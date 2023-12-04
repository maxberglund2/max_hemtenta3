const express = require('express');
const app = express();
const port = 3000;

const url = require('url');

const fs = require('fs');

const multer = require('multer');
const upload = multer({ dest: 'img/' });

// Prisma
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
}

main()
  .then(async () => {
    await prisma.$disconnect()
})
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})