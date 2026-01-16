import { Image, Stack, Placeholder, Alert } from "react-bootstrap";
import { useFetch } from "@hooks/useFetch";

export default function Avatar() {
  const { data: user, loading, error } = useFetch<{ username: string; email: string; avatarUrl: string }>("/api/auth/me");

  const initials =
    user?.username
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase() ?? "AU";

  if (error) {
    return (
      <Alert variant="danger" className="mb-0 py-2 px-3 small">
        Failed to load user
      </Alert>
    );
  }

  return (
    <Stack direction="horizontal" gap={2}>
      {/* Avatar */}
      {loading ? (
        <Placeholder animation="glow">
          <Placeholder className="rounded-circle" style={{ width: 32, height: 32 }} />
        </Placeholder>
      ) : user?.avatarUrl ? (
        <Image src={user.avatarUrl} alt={user.username} roundedCircle width={32} height={32} style={{ objectFit: "cover" }} />
      ) : (
        <div
          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
          style={{ width: 32, height: 32, fontSize: 12, fontWeight: 600 }}
        >
          {initials}
        </div>
      )}

      {/* User Info */}
      <div className="lh-sm">
        <div className="small fw-semibold">{loading ? <Placeholder xs={6} animation="glow"/> : user?.username}</div>
        <div className="small text-muted">{loading ? <Placeholder xs={8} animation="glow" /> : user?.email}</div>
      </div>
    </Stack>
  );
}
