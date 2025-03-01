import ws from 'ws';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';

let prisma;

if (!globalThis.prisma) {
    neonConfig.webSocketConstructor = ws;
    const connectionString = process.env.DATABASE_URL;

    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);

    prisma = new PrismaClient({ adapter });

    if (process.env.NODE_ENV !== 'production') {
        globalThis.prisma = prisma;
    }
} else {
    prisma = globalThis.prisma;
}

export default prisma;
