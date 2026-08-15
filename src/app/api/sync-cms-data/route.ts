import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const response = await fetch("https://toa.muro.click/api/public/settings", { cache: 'no-store' });
    const json = await response.json();
    const s = json.settings || {};

    // 1. Legal Settings (FAQ)
    const legalRec = await prisma.contentSettings.findUnique({ where: { key: 'legal_settings' } });
    const legalSet = legalRec && legalRec.value ? JSON.parse(legalRec.value) : {};
    legalSet.faq = s.faq && s.faq.length > 0 ? s.faq : legalSet.faq || [];
    await prisma.contentSettings.upsert({
      where: { key: 'legal_settings' },
      update: { value: JSON.stringify(legalSet) },
      create: { key: 'legal_settings', value: JSON.stringify(legalSet) }
    });

    // 2. Corporate Settings (Achievements, Teachers)
    const corpRec = await prisma.contentSettings.findUnique({ where: { key: 'corporate_settings' } });
    const corpSet = corpRec && corpRec.value ? JSON.parse(corpRec.value) : {};
    corpSet.achievements = s.achievements && s.achievements.length > 0 ? s.achievements : corpSet.achievements || [];
    
    // Öğretmenleri ezmemek için, DB'de yoksa alıyoruz. Varsa zaten resimlerini az önce admin klasöründen okuyup set ettik
    if (!corpSet.teachers || corpSet.teachers.length === 0) {
        corpSet.teachers = s.corporate_settings?.teachers || s.teachers || [];
    }
    
    await prisma.contentSettings.upsert({
      where: { key: 'corporate_settings' },
      update: { value: JSON.stringify(corpSet) },
      create: { key: 'corporate_settings', value: JSON.stringify(corpSet) }
    });

    // 3. Homepage Settings (Slider)
    const homeRec = await prisma.contentSettings.findUnique({ where: { key: 'homepage_settings' } });
    const homeSet = homeRec && homeRec.value ? JSON.parse(homeRec.value) : {};
    
    const slidersFromApi = s.homepage_settings?.slider || s.slider;
    if (slidersFromApi && slidersFromApi.length > 0) {
      homeSet.slider = slidersFromApi;
    } else {
      homeSet.slider = homeSet.slider || [];
    }

    await prisma.contentSettings.upsert({
      where: { key: 'homepage_settings' },
      update: { value: JSON.stringify(homeSet) },
      create: { key: 'homepage_settings', value: JSON.stringify(homeSet) }
    });

    return NextResponse.json({ success: true, message: "CMS Data Synced Successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
