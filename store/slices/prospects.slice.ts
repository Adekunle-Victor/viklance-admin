import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Prospect } from "@/lib/prospects.types";
import { authFetch } from "@/lib/api";

interface ProspectsState {
  items:   Prospect[];
  loading: boolean;
  error:   string | null;
}

const initialState: ProspectsState = { items: [], loading: false, error: null };

export const fetchProspect = createAsyncThunk(
  "prospects/fetchOne",
  async (id: number, { rejectWithValue }) => {
    const res  = await authFetch(`/api/prospects/${id}`);
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data as Prospect;
  }
);

export const fetchProspects = createAsyncThunk(
  "prospects/fetchAll",
  async (
    params: { status?: string; search?: string; assigned_to?: string } = {},
    { rejectWithValue }
  ) => {
    const filtered = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
    ) as Record<string, string>;
    const query = new URLSearchParams(filtered).toString();
    const res   = await authFetch(`/api/prospects${query ? `?${query}` : ""}`);
    const data  = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data as Prospect[];
  }
);

export const createProspect = createAsyncThunk(
  "prospects/create",
  async (
    body: { instagram_handle: string; name: string; phone?: string; email?: string; notes?: string },
    { rejectWithValue }
  ) => {
    const res  = await authFetch("/api/prospects", { method: "POST", body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data as Prospect;
  }
);

export const updateProspect = createAsyncThunk(
  "prospects/update",
  async (
    { id, ...body }: { id: number; name?: string; phone?: string; email?: string },
    { rejectWithValue }
  ) => {
    const res  = await authFetch(`/api/prospects/${id}`, {
      method: "PATCH", body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data as Prospect;
  }
);

export const updateProspectStatus = createAsyncThunk(
  "prospects/updateStatus",
  async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
    const res  = await authFetch(`/api/prospects/${id}/status`, {
      method: "PATCH", body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data as Prospect;
  }
);

export const markProspectDemoReady = createAsyncThunk(
  "prospects/markDemoReady",
  async (
    { id, frontend_demo_url, admin_demo_url, demo_email, demo_password }: {
      id: number; frontend_demo_url: string; admin_demo_url: string;
      demo_email?: string; demo_password?: string;
    },
    { rejectWithValue }
  ) => {
    const res  = await authFetch(`/api/prospects/${id}/demo`, {
      method: "PATCH", body: JSON.stringify({ frontend_demo_url, admin_demo_url, demo_email, demo_password }),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data as Prospect;
  }
);

export const sendProspectEmail = createAsyncThunk(
  "prospects/sendEmail",
  async (
    { id, type, message }: { id: number; type: "demo" | "proposal" | "followup"; message?: string },
    { rejectWithValue }
  ) => {
    const res  = await authFetch(`/api/prospects/${id}/email`, {
      method: "POST", body: JSON.stringify({ type, message }),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data as { success: boolean };
  }
);

export const updateProspectNotes = createAsyncThunk(
  "prospects/updateNotes",
  async ({ id, notes }: { id: number; notes: string }, { rejectWithValue }) => {
    const res  = await authFetch(`/api/prospects/${id}/notes`, {
      method: "PATCH", body: JSON.stringify({ notes }),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data as Prospect;
  }
);

const prospectsSlice = createSlice({
  name: "prospects",
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProspects.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(fetchProspects.fulfilled, (state, action: PayloadAction<Prospect[]>) => {
        state.loading = false;
        state.items   = action.payload;
      })
      .addCase(fetchProspects.rejected,  (state, action) => {
        state.loading = false;
        state.error   = action.payload as string;
      })
      .addCase(createProspect.fulfilled, (state, action: PayloadAction<Prospect>) => {
        state.items.unshift(action.payload);
      })
      .addCase(createProspect.rejected,  (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchProspect.fulfilled, (state, action: PayloadAction<Prospect>) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateProspect.fulfilled, (state, action: PayloadAction<Prospect>) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateProspectStatus.fulfilled, (state, action: PayloadAction<Prospect>) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateProspectNotes.fulfilled, (state, action: PayloadAction<Prospect>) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(markProspectDemoReady.fulfilled, (state, action: PayloadAction<Prospect>) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export const { clearError } = prospectsSlice.actions;
export default prospectsSlice.reducer;
