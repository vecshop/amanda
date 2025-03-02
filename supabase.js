const supabaseClient = window.supabase.createClient(
  "https://gjqcsdeszrqgollcyxnb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqcWNzZGVzenJxZ29sbGN5eG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxODgyNDYsImV4cCI6MjA1NTc2NDI0Nn0.idz5iJIknKADTLBZLaVvPKuPJMA0o7tiXgQgXI344_o"
);

// Export the client instance
export const supabase = supabaseClient;

// Authentication helpers
export const auth = {
  signUp: async ({ email, password, options }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: options.data,
          emailRedirectTo: `${window.location.origin}/index.html`,
        },
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("SignUp error:", error);
      return { data: null, error };
    }
  },

  // Sign in user
  signIn: async (email, password) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  // Sign out
  signOut: async () => {
    return await supabase.auth.signOut();
  },

  // Get current user
  getUser: async () => {
    return await supabase.auth.getUser();
  },
  checkSession: async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error || !session) {
      return { user: null, error: error || new Error("No session found") };
    }
    return { user: session.user, error: null };
  },
};

// Database helpers
export const db = {
  // Health Metrics
  healthMetrics: {
    create: async (data) => {
      return await supabase.from("health_metrics").insert([data]);
    },

    getLatest: async (userId) => {
      return await supabase
        .from("health_metrics")
        .select("*")
        .eq("user_id", userId)
        .order("recorded_at", { ascending: false })
        .limit(1);
      // Hapus .single() karena bisa menyebabkan error 406
    },

    getHistory: async (userId, limit = 6) => {
      return await supabase
        .from("health_metrics")
        .select("*")
        .eq("user_id", userId)
        .order("recorded_at", { ascending: true })
        .limit(limit);
    },
  },

  // Reminders
  reminders: {
    getActive: async (userId) => {
      return await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("scheduled_at", { ascending: true });
    },

    create: async (data) => {
      return await supabase.from("reminders").insert(data);
    },

    update: async (id, data) => {
      return await supabase.from("reminders").update(data).eq("id", id);
    },
  },

  // AI Recommendations
  recommendations: {
    getLatest: async (userId, limit = 3) => {
      return await supabase
        .from("ai_recommendations")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);
    },

    markAsViewed: async (id) => {
      return await supabase
        .from("ai_recommendations")
        .update({ is_viewed: true })
        .eq("id", id);
    },
  },
};
