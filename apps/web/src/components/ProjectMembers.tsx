import { useEffect, useState } from "react";
import * as memberService from "../services/projectMember";
import type { ProjectMember, ProjectRole, User } from "../services/projectMember";

const roles: ProjectRole[] = ["ADMIN", "MEMBER"];

export default function ProjectMembers({ projectId }: { projectId: string }) {
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<ProjectRole>("MEMBER");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refresh = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const [memberData, userData] = await Promise.all([
        memberService.getMembers(projectId),
        memberService.getUsers(),
      ]);
      setMembers(memberData);
      setUsers(userData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, [projectId]);

  const availableUsers = users.filter((user) => !members.some((member) => member.userId === user.id));

  const addMember = async () => {
    if (!userId) return;
    try {
      setSaving(true);
      await memberService.addMember(projectId, userId, role);
      setUserId("");
      await refresh();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add member.");
    } finally {
      setSaving(false);
    }
  };

  const changeRole = async (memberId: string, nextRole: ProjectRole) => {
    try {
      await memberService.updateMemberRole(projectId, memberId, nextRole);
      await refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to update role.");
    }
  };

  const removeMember = async (memberId: string) => {
    if (!window.confirm("Remove this member from the project?")) return;
    try {
      await memberService.removeMember(projectId, memberId);
      await refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to remove member.");
    }
  };

  return (
    <section className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold">Project Members</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <select value={userId} onChange={(event) => setUserId(event.target.value)} className="min-w-56 rounded border p-2">
          <option value="">Select a registered user</option>
          {availableUsers.map((user) => <option key={user.id} value={user.id}>{user.name} ({user.email})</option>)}
        </select>
        <select value={role} onChange={(event) => setRole(event.target.value as ProjectRole)} className="rounded border p-2">
          {roles.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <button onClick={addMember} disabled={!userId || saving} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">
          {saving ? "Adding..." : "Add member"}
        </button>
      </div>
      {loading ? <p className="mt-4">Loading members...</p> : members.length === 0 ? (
        <p className="mt-4 text-gray-500">No members added yet.</p>
      ) : (
        <div className="mt-4 divide-y rounded border">
          {members.map((member) => (
            <div key={member.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
              <div><p className="font-medium">{member.user.name}</p><p className="text-sm text-gray-500">{member.user.email}</p></div>
              <div className="flex items-center gap-3">
                <select value={member.role} onChange={(event) => changeRole(member.id, event.target.value as ProjectRole)} className="rounded border p-2">
                  <option value="ADMIN">ADMIN</option><option value="MEMBER">MEMBER</option>
                </select>
                <button onClick={() => removeMember(member.id)} className="text-sm text-red-600 hover:underline">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
