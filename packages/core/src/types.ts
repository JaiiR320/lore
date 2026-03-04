export type Task = {
  id: string;
  name: string;
  status: "active" | "completed";
  createdAt: string;
  updatedAt: string;
};
