import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Lead } from "@/lib/leads.types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface LeadsState {
  items:   Lead[];
  loading: boolean;
  error:   string | null;
}

const initialState: LeadsState = { items: [], loading: false, error: null };

const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
});

export const fetchLeads = createAsyncThunk(
  "leads/fetchAll",
  async (params: { status?: string; search?: string } = {}, { rejectWithValue }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res   = await fetch(`${API}/api/leads${query ? `?${query}` : ""}`, { headers: authHeader() });
    const data  = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data;
  }
);

export const updateLeadStatus = createAsyncThunk(
  "leads/updateStatus",
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    const res  = await fetch(`${API}/api/leads/${id}/status`, {
      method:  "PATCH",
      headers: authHeader(),
      body:    JSON.stringify({ status }),
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
      });
  },
});

export default leadsSlice.reducer;
