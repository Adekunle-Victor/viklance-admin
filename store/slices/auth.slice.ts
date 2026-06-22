import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface AuthUser {
  id:            string;
  email:         string;
  user_metadata: { role?: "super_admin"; full_name?: string; name?: string; [key: string]: unknown };
}

interface AuthState {
  user:         AuthUser | null;
  role:         "super_admin" | null;
  accessToken:  string | null;
  refreshToken: string | null;
  loading:      boolean;
  error:        string | null;
}

const initialState: AuthState = {
  user:         null,
  role:         typeof window !== "undefined" ? (localStorage.getItem("role") as AuthState["role"]) : null,
  accessToken:  typeof window !== "undefined" ? localStorage.getItem("access_token") : null,
  refreshToken: typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null,
  loading:      false,
  error:        null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error ?? "Login failed");
    return data;
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { getState }) => {
    const token = (getState() as { auth: AuthState }).auth.accessToken;
    await fetch(`${API}/api/auth/logout`, {
      method:  "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  }
);

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { getState, rejectWithValue }) => {
    const token = (getState() as { auth: AuthState }).auth.accessToken;
    const res   = await fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data.user;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading      = false;
        state.user         = action.payload.user;
        state.role         = action.payload.user?.user_metadata?.role ?? null;
        state.accessToken  = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        localStorage.setItem("access_token",  action.payload.access_token);
        localStorage.setItem("refresh_token", action.payload.refresh_token);
        if (state.role) localStorage.setItem("role", state.role);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user         = null;
        state.role         = null;
        state.accessToken  = null;
        state.refreshToken = null;
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("role");
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.role = action.payload?.user_metadata?.role ?? null;
        if (state.role) localStorage.setItem("role", state.role);
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user        = null;
        state.role        = null;
        state.accessToken = null;
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("role");
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
