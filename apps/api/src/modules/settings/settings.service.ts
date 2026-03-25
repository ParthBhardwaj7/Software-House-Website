import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getByKey(key: string): Promise<string | null> {
    const s = await this.prisma.settings.findUnique({ where: { key } });
    return s?.value ?? null;
  }

  async getMany(keys: string[]): Promise<Record<string, string>> {
    const items = await this.prisma.settings.findMany({
      where: { key: { in: keys } },
    });
    const map: Record<string, string> = {};
    for (const k of keys) map[k] = '';
    for (const i of items) map[i.key] = i.value;
    return map;
  }

  async set(key: string, value: string) {
    return this.prisma.settings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  async setMany(data: Record<string, string>) {
    for (const [key, value] of Object.entries(data)) {
      await this.set(key, value);
    }
  }
}
