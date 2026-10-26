import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";
import type { SessionRequest } from "@/lib/types";
import { Link } from "@tanstack/react-router";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock,
  Inbox,
  Send,
  Target,
  X,
} from "lucide-react";
import { useState } from "react";

type Status = SessionRequest["status"];

const STATUS_STYLES: Record<string, string> = {
  Pending: "border-warning/40 bg-warning/10 text-warning",
  "En attente": "border-warning/40 bg-warning/10 text-warning",
  Accepted: "border-success/40 bg-success/10 text-success",
  Acceptée: "border-success/40 bg-success/10 text-success",
  Declined: "border-destructive/40 bg-destructive/10 text-destructive",
  Refusée: "border-destructive/40 bg-destructive/10 text-destructive",
  Completed: "border-border bg-muted text-muted-foreground",
  Terminée: "border-border bg-muted text-muted-foreground",
};

function getStatusLabel(status: Status): string {
  if (status === "Accepted" || status === "Acceptée") return "Accepted";
  if (status === "Declined" || status === "Refusée") return "Declined";
  if (status === "Completed" || status === "Terminée") return "Completed";
  return "Pending";
}

function StatusBadge({ status }: { status: Status }) {
  const label = getStatusLabel(status);
  const style =
    STATUS_STYLES[status] ||
    STATUS_STYLES[label] ||
    "border-border bg-muted text-muted-foreground";

  return (
    <Badge
      variant="outline"
      className={`rounded-full px-3 py-1 text-xs font-medium ${style}`}
    >
      {label}
    </Badge>
  );
}

function RequestCard({
  request,
  index,
  onAccept,
  onDecline,
  onCancel,
}: {
  request: SessionRequest;
  index: number;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isSent =
    request.direction === "Sent" || request.direction === "Envoyée";
  const isPending =
    request.status === "Pending" || request.status === "En attente";
  const DirectionIcon = isSent ? ArrowUpRight : ArrowDownLeft;

  return (
    <Card
      className="rounded-lg border-border shadow-subtle transition-smooth hover:shadow-elevated"
      data-ocid={`requests.item.${index}`}
    >
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="font-display text-xl font-semibold">
              {request.skillName}
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2 text-sm">
              <DirectionIcon className="h-4 w-4 shrink-0 text-accent" />
              <span className="truncate">
                {isSent ? "To" : "From"} {request.mentorName}
              </span>
            </CardDescription>
          </div>
          <StatusBadge status={request.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {request.message}
        </p>

        <dl className="grid gap-3 border-t border-border pt-4 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                Proposed Date & Time
              </dt>
              <dd className="truncate font-medium">{request.proposedDate}</dd>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                Requested On
              </dt>
              <dd className="truncate font-medium">{request.createdAt}</dd>
            </div>
          </div>
        </dl>

        <div className="flex items-start gap-2 rounded-md bg-muted/60 p-3">
          <Target className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <p className="text-sm text-muted-foreground">
            Learning objective: master {request.skillName} with{" "}
            {request.mentorName}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isSent && isPending ? (
            <>
              <Button
                type="button"
                size="sm"
                className="rounded-full"
                onClick={() => onAccept(request.id)}
                data-ocid={`requests.accept_button.${index}`}
              >
                <Check className="h-4 w-4 mr-1.5" />
                Accept
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={() => onDecline(request.id)}
                data-ocid={`requests.decline_button.${index}`}
              >
                <X className="h-4 w-4 mr-1.5" />
                Decline
              </Button>
            </>
          ) : null}

          {isSent && isPending ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-full text-destructive hover:text-destructive"
              onClick={() => setConfirmOpen(true)}
              data-ocid={`requests.cancel_button.${index}`}
            >
              <X className="h-4 w-4 mr-1.5" />
              Cancel Request
            </Button>
          ) : null}

          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="rounded-full"
            asChild
          >
            <Link
              to="/mentors/$id"
              params={{ id: request.mentorId }}
              data-ocid={`requests.mentor_link.${index}`}
            >
              View Mentor Profile
            </Link>
          </Button>
        </div>
      </CardContent>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent data-ocid={`requests.cancel_dialog.${index}`}>
          <DialogHeader>
            <DialogTitle className="font-display">
              Cancel this session request?
            </DialogTitle>
            <DialogDescription>
              The session request for {request.skillName} with{" "}
              {request.mentorName} will be withdrawn and marked as declined.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => setConfirmOpen(false)}
              data-ocid={`requests.cancel_dialog.cancel_button.${index}`}
            >
              Keep Request
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="rounded-full"
              onClick={() => {
                onCancel(request.id);
                setConfirmOpen(false);
              }}
              data-ocid={`requests.cancel_dialog.confirm_button.${index}`}
            >
              Confirm Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function EmptyState({ direction }: { direction: "Sent" | "Received" }) {
  const isSent = direction === "Sent";
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 px-6 py-16 text-center"
      data-ocid={`requests.${isSent ? "sent" : "received"}_empty_state`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        {isSent ? (
          <Send className="h-6 w-6 text-muted-foreground" />
        ) : (
          <Inbox className="h-6 w-6 text-muted-foreground" />
        )}
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold">
        {isSent ? "No sent requests" : "No received requests"}
      </h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {isSent
          ? "Explore mentors and propose your first session to exchange skills and connect."
          : "Session requests sent to you by other students will appear here."}
      </p>
      <Button type="button" className="mt-6 rounded-full" asChild>
        <Link to="/explore" search={{}} data-ocid="requests.empty_state.link">
          Explore Mentors
        </Link>
      </Button>
    </div>
  );
}

function RequestList({
  requests,
  isSentTab,
  onAccept,
  onDecline,
  onCancel,
}: {
  requests: SessionRequest[];
  isSentTab: boolean;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  const filtered = requests.filter((request) => {
    const isSent =
      request.direction === "Sent" || request.direction === "Envoyée";
    return isSentTab ? isSent : !isSent;
  });

  if (filtered.length === 0) {
    return <EmptyState direction={isSentTab ? "Sent" : "Received"} />;
  }

  return (
    <div className="grid gap-5">
      {filtered.map((request, index) => (
        <RequestCard
          key={request.id}
          request={request}
          index={index + 1}
          onAccept={onAccept}
          onDecline={onDecline}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
}

export function RequestsPage() {
  const { requests, updateRequestStatus } = useStore();

  const sentCount = requests.filter(
    (r) => r.direction === "Sent" || r.direction === "Envoyée",
  ).length;
  const receivedCount = requests.filter(
    (r) => r.direction === "Received" || r.direction === "Reçue",
  ).length;

  return (
    <section className="container py-16 md:py-24" data-ocid="requests.page">
      <div className="max-w-3xl">
        <p className="label-eyebrow">Exchanges & Sessions</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
          Session Requests
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Track proposed and received skill exchange sessions, and accept,
          decline, or cancel requests seamlessly.
        </p>
      </div>

      <Tabs defaultValue="sent" className="mt-10" data-ocid="requests.tabs">
        <TabsList className="rounded-full">
          <TabsTrigger
            value="sent"
            className="rounded-full"
            data-ocid="requests.sent.tab"
          >
            Sent
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
              {sentCount}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="received"
            className="rounded-full"
            data-ocid="requests.received.tab"
          >
            Received
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
              {receivedCount}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sent" className="mt-8">
          <RequestList
            requests={requests}
            isSentTab={true}
            onAccept={(id) => updateRequestStatus(id, "Accepted")}
            onDecline={(id) => updateRequestStatus(id, "Declined")}
            onCancel={(id) => updateRequestStatus(id, "Declined")}
          />
        </TabsContent>

        <TabsContent value="received" className="mt-8">
          <RequestList
            requests={requests}
            isSentTab={false}
            onAccept={(id) => updateRequestStatus(id, "Accepted")}
            onDecline={(id) => updateRequestStatus(id, "Declined")}
            onCancel={(id) => updateRequestStatus(id, "Declined")}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}
