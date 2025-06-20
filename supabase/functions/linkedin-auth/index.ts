
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { code, state } = await req.json();
    
    const linkedinClientId = Deno.env.get('LINKEDIN_CLIENT_ID');
    const linkedinClientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET');
    const redirectUri = Deno.env.get('LINKEDIN_REDIRECT_URI');

    if (!linkedinClientId || !linkedinClientSecret) {
      throw new Error('LinkedIn credentials not configured');
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: linkedinClientId,
        client_secret: linkedinClientSecret,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(`LinkedIn token exchange failed: ${tokenData.error_description}`);
    }

    // Store the access token in the admin settings
    const { error: settingsError } = await supabaseClient
      .from('admin_settings')
      .upsert({
        setting_key: 'linkedin_access_token',
        setting_value: {
          access_token: tokenData.access_token,
          expires_in: tokenData.expires_in,
          created_at: new Date().toISOString()
        },
        description: 'LinkedIn API access token for social media integration'
      });

    if (settingsError) {
      console.error('Error storing LinkedIn token:', settingsError);
      throw new Error('Failed to store LinkedIn credentials');
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'LinkedIn connected successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('LinkedIn auth error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
