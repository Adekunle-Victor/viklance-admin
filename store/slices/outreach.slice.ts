import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authFetch } from "@/lib/api";

interface OutreachState {
  loading:       boolean;
  importing:     boolean;
  error:         string | null;
  lastSentCount: number | null;
}

const initialState: OutreachState = { loading: false, importing: false, error: null, lastSentCount: null };

export const bulkSend = createAsyncThunk(
  "outreach/bulkSend",
  async (
    body: {
      prospectIds:  number[];
      type:         "demo" | "proposal" | "followup";
      businessType: "ecommerce" | "dealership";
      message?:     string;
    },
    { rejectWithValue }
  ) => {
    const res  = await authFetch("/api/outreach/bulk", { method: "POST", body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data as { sent: number };
  }
);

type DemoRow = {
  name:              string;
  frontend_demo_url: string;
  admin_demo_url:    string;
  demo_email:        string;
  demo_password:     string;
};

export const importDemo = createAsyncThunk<
  { updated: number; notFound: string[] },
  DemoRow[],
  { rejectValue: string }
>("outreach/importDemo", async (rows, { rejectWithValue }) => {
  const res = await authFetch("/api/outreach/import-demo", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(rows),
  });
  const data = await res.json();
  if (!res.ok) return rejectWithValue(data.error ?? "Import failed");
  return data as { updated: number; notFound: string[] };
});

const outreachSlice = createSlice({
  name: "outreach",
  initialState,
  reducers: {
    clearOutreachError: (state) => { state.error = null; },
    clearSentCount:     (state) => { state.lastSentCount = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bulkSend.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(bulkSend.fulfilled, (state, action: PayloadAction<{ sent: number }>) => {
        state.loading       = false;
        state.lastSentCount = action.payload.sent;
      })
      .addCase(bulkSend.rejected,    (state, action) => {
        state.loading = false;
        state.error   = action.payload as string;
      })
      .addCase(importDemo.pending,   (state) => { state.importing = true; state.error = null; })
      .addCase(importDemo.fulfilled, (state) => { state.importing = false; })
      .addCase(importDemo.rejected,  (state, action) => {
        state.importing = false;
        state.error     = action.payload as string;
      });
  },
});

export const { clearOutreachError, clearSentCount } = outreachSlice.actions;
export default outreachSlice.reducer;
