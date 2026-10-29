import { CATEGORY_BY_VALUE, type Category } from "@/lib/categories";
import { formatShortMonth } from "@/lib/format";
import { prisma } from "@/lib/prisma";

const TREND_MONTHS = 6;
const RECENT_LIMIT = 8;

export interface DashboardSummary {
  currency: string;
  income: number;
  expenses: number;
  net: number;
  transactions: number;
}

export interface CategoryBreakdown {
  category: Category;
  label: string;
  emoji: string;
  tint: string;
  color: string;
  total: number;
  share: number;
  count: number;
}

export interface MonthlyPoint {
  key: string;
  label: string;
  income: number;
  expenses: number;
}

export interface RecentExpense {
  id: string;
  category: Category;
  label: string;
  emoji: string;
  tint: string;
  color: string;
  amount: number;
  description: string | null;
  date: Date;
}

export interface DashboardData {
  summary: DashboardSummary;
  breakdown: CategoryBreakdown[];
  trend: MonthlyPoint[];
  recentExpenses: RecentExpense[];
  topCategory: CategoryBreakdown | null;
}

function monthStart(year: number, month: number): Date {
  return new Date(Date.UTC(year, month, 1));
}

function monthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function toNumber(value: { toNumber(): number } | null | undefined): number {
  return value ? value.toNumber() : 0;
}

export async function getDashboardData(
  userId: string,
  now: Date = new Date(),
): Promise<DashboardData> {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();

  const currentMonthStart = monthStart(year, month);
  const nextMonthStart = monthStart(year, month + 1);
  const trendStart = monthStart(year, month - (TREND_MONTHS - 1));

  const [
    profile,
    incomeTotals,
    expenseTotals,
    groupedExpenses,
    recentExpenses,
    trendExpenses,
    trendIncomes,
  ] = await Promise.all([
    prisma.profile.findUnique({
      where: { userId },
      select: { currency: true },
    }),
    prisma.income.aggregate({
      where: {
        userId,
        incomeDate: { gte: currentMonthStart, lt: nextMonthStart },
      },
      _sum: { amount: true },
    }),
    prisma.expense.aggregate({
      where: {
        userId,
        expenseDate: { gte: currentMonthStart, lt: nextMonthStart },
      },
      _sum: { amount: true },
      _count: { _all: true },
    }),
    prisma.expense.groupBy({
      by: ["category"],
      where: {
        userId,
        expenseDate: { gte: currentMonthStart, lt: nextMonthStart },
      },
      _sum: { amount: true },
      _count: { _all: true },
    }),
    prisma.expense.findMany({
      where: { userId },
      orderBy: [{ expenseDate: "desc" }, { createdAt: "desc" }],
      take: RECENT_LIMIT,
      select: {
        id: true,
        category: true,
        amount: true,
        description: true,
        expenseDate: true,
      },
    }),
    prisma.expense.findMany({
      where: { userId, expenseDate: { gte: trendStart, lt: nextMonthStart } },
      select: { amount: true, expenseDate: true },
    }),
    prisma.income.findMany({
      where: { userId, incomeDate: { gte: trendStart, lt: nextMonthStart } },
      select: { amount: true, incomeDate: true },
    }),
  ]);

  const expenses = toNumber(expenseTotals._sum.amount);
  const income = toNumber(incomeTotals._sum.amount);

  const breakdown: CategoryBreakdown[] = groupedExpenses
    .map((group) => {
      const option = CATEGORY_BY_VALUE[group.category];
      const total = toNumber(group._sum.amount);

      return {
        category: group.category,
        label: option.label,
        emoji: option.emoji,
        tint: option.tint,
        color: option.color,
        total,
        share: expenses > 0 ? total / expenses : 0,
        count: group._count._all,
      };
    })
    .sort((a, b) => b.total - a.total);

  const trend: MonthlyPoint[] = Array.from(
    { length: TREND_MONTHS },
    (_, index) => {
      const pointDate = monthStart(year, month - (TREND_MONTHS - 1) + index);

      return {
        key: monthKey(pointDate.getUTCFullYear(), pointDate.getUTCMonth()),
        label: formatShortMonth(pointDate),
        income: 0,
        expenses: 0,
      };
    },
  );

  const trendByKey = new Map(trend.map((point) => [point.key, point]));

  for (const incomeRow of trendIncomes) {
    const point = trendByKey.get(
      monthKey(
        incomeRow.incomeDate.getUTCFullYear(),
        incomeRow.incomeDate.getUTCMonth(),
      ),
    );
    if (point) {
      point.income += toNumber(incomeRow.amount);
    }
  }

  for (const expenseRow of trendExpenses) {
    const point = trendByKey.get(
      monthKey(
        expenseRow.expenseDate.getUTCFullYear(),
        expenseRow.expenseDate.getUTCMonth(),
      ),
    );
    if (point) {
      point.expenses += toNumber(expenseRow.amount);
    }
  }

  return {
    summary: {
      currency: profile?.currency ?? "USD",
      income,
      expenses,
      net: income - expenses,
      transactions: expenseTotals._count._all,
    },
    breakdown,
    trend,
    topCategory: breakdown[0] ?? null,
    recentExpenses: recentExpenses.map((expense) => {
      const option = CATEGORY_BY_VALUE[expense.category];

      return {
        id: expense.id,
        category: expense.category,
        label: option.label,
        emoji: option.emoji,
        tint: option.tint,
        color: option.color,
        amount: toNumber(expense.amount),
        description: expense.description,
        date: expense.expenseDate,
      };
    }),
  };
}
