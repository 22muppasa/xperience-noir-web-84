
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

    // Get LinkedIn access token from admin settings
    const { data: tokenSetting, error: tokenError } = await supabaseClient
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', 'linkedin_access_token')
      .single();

    if (tokenError || !tokenSetting) {
      throw new Error('LinkedIn not connected. Please connect LinkedIn first.');
    }

    const accessToken = tokenSetting.setting_value.access_token;

    // First, get the person's profile to get their ID
    const profileResponse = await fetch('https://api.linkedin.com/v2/people/~', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!profileResponse.ok) {
      throw new Error('Failed to fetch LinkedIn profile');
    }

    const profile = await profileResponse.json();
    const personId = profile.id;

    // Fetch recent posts from LinkedIn
    const postsResponse = await fetch(
      `https://api.linkedin.com/v2/shares?q=owners&owners=urn:li:person:${personId}&sortBy=CREATED_TIME&count=20`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!postsResponse.ok) {
      throw new Error('Failed to fetch LinkedIn posts');
    }

    const postsData = await postsResponse.json();
    const posts = postsData.elements || [];

    // Transform LinkedIn posts to our format
    const transformedPosts = posts.map((post: any) => {
      const text = post.text?.text || '';
      const createdTime = new Date(post.created?.time || Date.now());
      
      return {
        id: post.id || `linkedin-${Date.now()}-${Math.random()}`,
        platform: 'linkedin',
        content: text,
        image: post.content?.contentEntities?.[0]?.thumbnails?.[0]?.resolvedUrl || null,
        date: createdTime.toISOString().split('T')[0],
        likes: 0, // LinkedIn API v2 doesn't provide engagement metrics in basic posts endpoint
        comments: 0,
        link: `https://www.linkedin.com/feed/update/${post.id}`,
        created_at: createdTime.toISOString()
      };
    });

    // Store posts in our database for caching
    if (transformedPosts.length > 0) {
      const { error: insertError } = await supabaseClient
        .from('linkedin_posts_cache')
        .upsert(
          transformedPosts.map(post => ({
            linkedin_post_id: post.id,
            content: post.content,
            image_url: post.image,
            created_at: post.created_at,
            linkedin_url: post.link,
            last_synced: new Date().toISOString()
          })),
          { onConflict: 'linkedin_post_id' }
        );

      if (insertError) {
        console.error('Error caching LinkedIn posts:', insertError);
      }
    }

    return new Response(JSON.stringify({ 
      posts: transformedPosts,
      total: transformedPosts.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('LinkedIn posts fetch error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      posts: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
