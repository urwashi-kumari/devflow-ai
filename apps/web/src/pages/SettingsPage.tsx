import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword, updateProfile } from "../services/auth";
import { useAuthContext } from "../context/AuthContext";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "object" && error && "response" in error) {
    const response = (error as { response?: { data?: { message?: string | string[] } } }).response;
    const message = response?.data?.message;
    return Array.isArray(message) ? message[0] : message ?? fallback;
  }
  return fallback;
};

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuthContext();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
  }, [user]);

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileMessage("");
    setSavingProfile(true);
    try {
      const updatedUser = await updateProfile({ name: name.trim(), email: email.trim() });
      updateUser(updatedUser);
      setProfileMessage("Profile saved.");
    } catch (error) {
      setProfileMessage(getErrorMessage(error, "Unable to save your profile."));
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordMessage("");
    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      return;
    }
    setSavingPassword(true);
    try {
      const result = await changePassword({ currentPassword, newPassword });
      setPasswordMessage(result.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordMessage(getErrorMessage(error, "Unable to update your password."));
    } finally {
      setSavingPassword(false);
    }
  };

  const signOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <main className="mx-auto max-w-4xl p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-500">Manage your account and security preferences.</p>
      </div>

      <div className="space-y-6">
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
            <p className="mt-1 text-sm text-gray-500">Update the information your team sees.</p>
          </div>
          <form className="space-y-4" onSubmit={saveProfile}>
            <label className="block text-sm font-medium text-gray-700">
              Full name
              <input className="mt-1 w-full rounded-lg border px-3 py-2" value={name} onChange={(event) => setName(event.target.value)} required />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Email address
              <input className="mt-1 w-full rounded-lg border px-3 py-2" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            {profileMessage && <p className="text-sm text-gray-600" role="status">{profileMessage}</p>}
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={savingProfile}>
              {savingProfile ? "Saving..." : "Save profile"}
            </button>
          </form>
        </section>

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Password</h2>
            <p className="mt-1 text-sm text-gray-500">Use a unique password with at least 6 characters.</p>
          </div>
          <form className="space-y-4" onSubmit={savePassword}>
            <label className="block text-sm font-medium text-gray-700">Current password<input className="mt-1 w-full rounded-lg border px-3 py-2" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required /></label>
            <label className="block text-sm font-medium text-gray-700">New password<input className="mt-1 w-full rounded-lg border px-3 py-2" type="password" minLength={6} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required /></label>
            <label className="block text-sm font-medium text-gray-700">Confirm new password<input className="mt-1 w-full rounded-lg border px-3 py-2" type="password" minLength={6} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required /></label>
            {passwordMessage && <p className="text-sm text-gray-600" role="status">{passwordMessage}</p>}
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={savingPassword}>
              {savingPassword ? "Updating..." : "Update password"}
            </button>
          </form>
        </section>

        <section className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-900">Sign out</h2>
          <p className="mt-1 text-sm text-red-800">End your current session on this device.</p>
          <button className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-2 text-red-700 hover:bg-red-100" onClick={signOut}>Sign out</button>
        </section>
      </div>
    </main>
  );
}
