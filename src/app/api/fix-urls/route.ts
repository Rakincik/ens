import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    let updatedCoursesCount = 0;
    let updatedSettingsCount = 0;

    // Fix Courses
    const courses = await prisma.course.findMany();
    for (const course of courses) {
      if (course.image) {
        let newImage = course.image;
        if (newImage.includes('turkceoabtdeyiz.com')) {
          newImage = newImage.replace(/https:\/\/turkceoabtdeyiz\.com/g, 'https://toa.muro.click');
        }
        if (newImage.startsWith('/uploads/')) {
          newImage = 'https://toa.muro.click' + newImage;
        }
        
        if (newImage !== course.image) {
          await prisma.course.update({
            where: { id: course.id },
            data: { image: newImage }
          });
          updatedCoursesCount++;
        }
      }
    }

    // Fix Settings
    const settings = await prisma.contentSettings.findMany();
    for (const setting of settings) {
      let newVal = setting.value;
      let changed = false;
      
      if (newVal.includes('turkceoabtdeyiz.com')) {
        newVal = newVal.replace(/https:\/\/turkceoabtdeyiz\.com/g, 'https://toa.muro.click');
        changed = true;
      }
      if (newVal.includes('"/slider/')) {
        newVal = newVal.replace(/"\/slider\//g, '"https://toa.muro.click/slider/');
        changed = true;
      }
      if (newVal.includes('"/uploads/')) {
        newVal = newVal.replace(/"\/uploads\//g, '"https://toa.muro.click/uploads/');
        changed = true;
      }

      if (changed) {
        await prisma.contentSettings.update({
          where: { key: setting.key },
          data: { value: newVal }
        });
        updatedSettingsCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCoursesCount} courses and ${updatedSettingsCount} settings.`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
