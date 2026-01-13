import React, { useState, useEffect } from "react";

// Type definition - sesuaikan dengan backend
type Member = {
  id_member: number;
  name: string;
  role: string;
};

export default function MembersTable() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      setError(null);
      setDebugInfo(null);

      try {
        console.log("🔄 Fetching /api/members...");

        const res = await fetch("/api/members");

        console.log("📥 Response:", {
          status: res.status,
          statusText: res.statusText,
          ok: res.ok,
          headers: Object.fromEntries(res.headers.entries()),
        });

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status} ${res.statusText}`);
        }

        const rawData = await res.json();

        console.log("📦 Raw response data:", rawData);
        console.log("📊 Data analysis:", {
          type: typeof rawData,
          isArray: Array.isArray(rawData),
          length: rawData?.length,
          keys: Object.keys(rawData || {}),
          firstItem: rawData?.[0],
        });

        // Set debug info untuk ditampilkan
        setDebugInfo({
          type: typeof rawData,
          isArray: Array.isArray(rawData),
          length: rawData?.length,
          keys: Object.keys(rawData || {}),
          sample: JSON.stringify(rawData?.[0] || rawData, null, 2),
        });

        // Handle berbagai format response
        let data: Member[] = [];

        if (Array.isArray(rawData)) {
          // Response adalah array langsung
          data = rawData;
        } else if (rawData?.data && Array.isArray(rawData.data)) {
          // Response dalam format { data: [...] }
          data = rawData.data;
        } else if (rawData?.members && Array.isArray(rawData.members)) {
          // Response dalam format { members: [...] }
          data = rawData.members;
        } else if (rawData?.results && Array.isArray(rawData.results)) {
          // Response dalam format { results: [...] }
          data = rawData.results;
        } else {
          console.warn("⚠️ Unexpected data format:", rawData);
          data = [];
        }

        console.log("✅ Processed data:", data);
        console.log("✅ Total members:", data.length);

        setMembers(data);
      } catch (err: any) {
        console.error("❌ Fetch error:", err);
        setError(err.message);
        setDebugInfo({
          error: err.message,
          stack: err.stack,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Debug: log setiap kali members berubah
  useEffect(() => {
    console.log("🎨 Members state updated:", members);
  }, [members]);

  // Render states
  console.log("🖼️ Current render state:", {
    loading,
    hasError: !!error,
    membersCount: members.length,
  });

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-blue-600">⏳ Loading members...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500 font-bold">❌ Error: {error}</p>
        {debugInfo && (
          <details className="mt-4 p-3 bg-red-50 rounded text-sm">
            <summary className="cursor-pointer font-semibold">
              Debug Info
            </summary>
            <pre className="mt-2 overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        )}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="p-4">
        <p className="text-yellow-600 font-semibold">
          ⚠️ No members found in database.
        </p>
        {debugInfo && (
          <details className="mt-4 p-3 bg-yellow-50 rounded text-sm">
            <summary className="cursor-pointer font-semibold">
              Debug Info (Response received but empty)
            </summary>
            <pre className="mt-2 overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        )}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          ✅ Found <strong>{members.length}</strong> member
          {members.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Debug panel (comment out di production) */}
      {debugInfo && (
        <details className="mb-4 p-3 bg-blue-50 rounded text-sm">
          <summary className="cursor-pointer font-semibold">
            🐛 Debug Info
          </summary>
          <pre className="mt-2 overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </details>
      )}

      <table className="table-auto border border-gray-300 w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m, index) => (
            <tr key={m.id_member || index} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">
                {m.id_member}
              </td>
              <td className="border border-gray-300 px-4 py-2">{m.name}</td>
              <td className="border border-gray-300 px-4 py-2">{m.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Sample data display */}
      <details className="mt-4 text-xs text-gray-500">
        <summary className="cursor-pointer">View raw data</summary>
        <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-60">
          {JSON.stringify(members, null, 2)}
        </pre>
      </details>
    </div>
  );
}
