import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET all settings
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*');

    if (error) throw error;

    // Convert array to object for easier access
    const settingsObj: any = {};
    data?.forEach((setting: any) => {
      settingsObj[setting.key] = setting.value;
    });

    return NextResponse.json({ success: true, data: settingsObj });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST/PUT update settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Update each setting
    for (const [key, value] of Object.entries(body)) {
      const { error } = await supabase
        .from('settings')
        .upsert({ key, value: value as string }, { onConflict: 'key' });
      
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
