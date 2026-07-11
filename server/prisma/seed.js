require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const projetosSeed = [
  { titulo: 'Dashboard', categoria: 'Web App', ano: 2025, tecnologias: 'React · TypeScript · JavaScript', imagemUrl: 'img/projeto 1.png' },
  { titulo: 'Loja Online Premium', categoria: 'E-Commerce', ano: 2025, tecnologias: 'Next.js · JavaScript · Tailwind', imagemUrl: 'img/projeto 2.png' },
  { titulo: 'SaaS Landing Page', categoria: 'Landing Page', ano: 2024, tecnologias: 'HTML · CSS · JavaScript', imagemUrl: 'img/projeto 3.png' },
  { titulo: 'Crypto Exchange', categoria: 'Fintech', ano: 2024, tecnologias: 'Next.js · Web3 · API REST', imagemUrl: 'img/projeto 4.png' },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'kelvison.marcos10@gmail.com';
  const adminSenha = process.env.ADMIN_PASSWORD || 'trocar senha';

  const senhaHash = await bcrypt.hash(adminSenha, 10);
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, senhaHash },
  });
  console.log(`Admin garantido: ${adminEmail}`);

  for (const projeto of projetosSeed) {
    const existente = await prisma.projeto.findFirst({ where: { titulo: projeto.titulo } });
    if (!existente) {
      await prisma.projeto.create({ data: projeto });
      console.log(`Projeto criado: ${projeto.titulo}`);
    }
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
