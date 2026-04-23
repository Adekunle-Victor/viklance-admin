import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Lead } from "@/lib/leads.types";
import { authFetch } from "@/lib/api";

interface LeadsState {
  items:   Lead[];
  loading: boolean;
  error:   string | null;
}

const initialState: LeadsState = { items: [], loading: false, error: null };

export const fetchLeads = createAsyncThunk(
  "leads/fetchAll",
  async (params: { status?: string; search?: string } = {}, { rejectWithValue }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res   = await authFetch(`/api/leads${query ? `?${query}` : ""}`);
    const data  = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data;
  }
);

export const markDemoReady = createAsyncThunk(
  "leads/markDemoReady",
  async ({ id, demo_url }: { id: string; demo_url: string }, { rejectWithValue }) => {
    const res  = await authFetch(`/api/leads/${id}/demo`, {
      method: "PATCH",
      body:   JSON.stringify({ demo_url }),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data as Lead;
  }
);

export const updateLeadStatus = createAsyncThunk(
  "leads/updateStatus",
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    const res  = await authFetch(`/api/leads/${id}/status`, {
      method: "PATCH",
      body:   JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data;
  }
);

const leadsSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending,  (state) => { state.loading = true; state.error = null; })
      .addCase(fetchLeads.fulfilled, (state, action: PayloadAction<Lead[]>) => {
        state.loading = false;
        state.items   = action.payload;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload as string;
      })
      .addCase(updateLeadStatus.fulfilled, (state, action: PayloadAction<Lead>) => {
        const idx = state.items.findIndex((l) => l.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(markDemoReady.fulfilled, (state, action: PayloadAction<Lead>) => {
        const idx = state.items.findIndex((l) => l.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export default leadsSlice.reducer;
