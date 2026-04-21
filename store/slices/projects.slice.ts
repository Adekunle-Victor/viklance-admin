import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Project } from "@/lib/projects.types";
import { authFetch } from "@/lib/api";

interface ProjectsState {
  items:   Project[];
  loading: boolean;
  error:   string | null;
}

const initialState: ProjectsState = { items: [], loading: false, error: null };

export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async (_, { rejectWithValue }) => {
    const res  = await authFetch("/api/projects");
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data;
  }
);

export const updateProjectStatus = createAsyncThunk(
  "projects/updateStatus",
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    const res  = await authFetch(`/api/projects/${id}/status`, {
      method: "PATCH",
      body:   JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data;
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending,  (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.loading = false;
        state.items   = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload as string;
      })
      .addCase(updateProjectStatus.fulfilled, (state, action: PayloadAction<Project>) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export default projectsSlice.reducer;
