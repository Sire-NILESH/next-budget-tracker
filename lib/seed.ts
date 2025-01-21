const { PrismaClient } = require("@prisma/client");
const { subDays, addDays } = require("date-fns");

const prisma = new PrismaClient();

async function main() {
  // Create sample user data
  const userId = "user_2ixO8GrGOyKetvPhPbef7gmP0iF";
  await prisma.userSettings.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      currency: "USD",
    },
  });

  // Create categories for the user
  const categories = [
    // Income categories
    { name: "Salary", icon: "💼", type: "income" },
    { name: "Freelancing", icon: "💻", type: "income" },
    { name: "Investments", icon: "📈", type: "income" },
    { name: "Dividends", icon: "💰", type: "income" },
    { name: "Gifts", icon: "🎁", type: "income" },
    { name: "Rent Income", icon: "🏠", type: "income" },
    { name: "Royalties", icon: "🎵", type: "income" },
    { name: "Side Hustle", icon: "🔧", type: "income" },

    // Expense categories
    { name: "Food & Dining", icon: "🍔", type: "expense" },
    { name: "Groceries", icon: "🛒", type: "expense" },
    { name: "Transportation", icon: "🚗", type: "expense" },
    { name: "Entertainment", icon: "🎮", type: "expense" },
    { name: "Utilities", icon: "💡", type: "expense" },
    { name: "Rent", icon: "🏠", type: "expense" },
    { name: "Healthcare", icon: "⚕️", type: "expense" },
    { name: "Insurance", icon: "🛡️", type: "expense" },
    { name: "Travel", icon: "✈️", type: "expense" },
    { name: "Shopping", icon: "🛍️", type: "expense" },
    { name: "Education", icon: "📚", type: "expense" },
    { name: "Fitness", icon: "🏋️‍♂️", type: "expense" },
    { name: "Childcare", icon: "🍼", type: "expense" },
    { name: "Subscriptions", icon: "📺", type: "expense" },
    { name: "Charity", icon: "❤️", type: "expense" },
    { name: "Miscellaneous", icon: "❓", type: "expense" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        name_userId_type: { name: category.name, userId, type: category.type },
      },
      update: {},
      create: {
        ...category,
        userId,
      },
    });
  }

  // Generate transactions for the last year
  const startDate = subDays(new Date(), 365);
  const transactions = [];
  for (let i = 0; i < 200; i++) {
    const date = addDays(startDate, Math.floor(Math.random() * 365));
    const category = categories[Math.floor(Math.random() * categories.length)];
    const amount = parseFloat(
      (Math.random() * (category.type === "income" ? 5000 : 300)).toFixed(2)
    );
    transactions.push({
      id: `txn-${i}`,
      amount,
      description: `Mock ${category.name} transaction`,
      date,
      userId,
      type: category.type,
      category: category.name,
      categoryIcon: category.icon,
    });
  }
  await prisma.transaction.createMany({ data: transactions });

  // Generate month and year histories
  const monthHistories = [];
  const yearHistories = [];
  for (let month = 0; month < 12; month++) {
    const income = parseFloat((Math.random() * 10000).toFixed(2));
    const expense = parseFloat((Math.random() * 3000).toFixed(2));

    monthHistories.push({
      userId,
      day: 1,
      month: month + 1,
      year: new Date().getFullYear(),
      income,
      expense,
    });

    yearHistories.push({
      userId,
      month: month + 1,
      year: new Date().getFullYear(),
      income,
      expense,
    });
  }
  await prisma.monthHistory.createMany({ data: monthHistories });
  await prisma.yearHistory.createMany({ data: yearHistories });

  console.log("Seeding completed with more categories!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Run
// npx ts-node lib/seed.ts
