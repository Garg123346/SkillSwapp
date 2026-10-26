import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import type { Conversation } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function ConversationRow({
  conversation,
  active,
  onSelect,
}: {
  conversation: Conversation;
  active: boolean;
  onSelect: () => void;
}) {
  const lastMessage =
    conversation.messages[conversation.messages.length - 1] ?? null;
  const preview = lastMessage
    ? `${lastMessage.sender === "me" ? "You: " : ""}${lastMessage.text}`
    : "No messages yet.";

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active ? "true" : undefined}
      data-ocid={`messages.conversation.item.${conversation.id}`}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border border-transparent px-3 py-3 text-left transition-smooth hover:bg-muted",
        active && "border-border bg-muted shadow-subtle",
      )}
    >
      <Avatar className="size-11 border border-border">
        <AvatarFallback className="bg-secondary text-sm font-semibold text-secondary-foreground">
          {conversation.participantInitials}
        </AvatarFallback>
      </Avatar>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="truncate font-medium text-foreground">
            {conversation.participantName}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {conversation.lastActive}
          </span>
        </span>
        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
          {conversation.subject}
        </span>
        <span className="mt-1 flex items-center justify-between gap-2">
          <span
            className={cn(
              "truncate text-sm text-muted-foreground",
              conversation.unreadCount > 0 && "font-medium text-foreground",
            )}
          >
            {preview}
          </span>
          {conversation.unreadCount > 0 && (
            <span
              className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground"
              aria-label={`${conversation.unreadCount} unread message(s)`}
              data-ocid={`messages.unread.${conversation.id}`}
            >
              {conversation.unreadCount}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}

export function ChatPane({ conversation }: { conversation: Conversation }) {
  const { sendMessage } = useStore();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageCount = conversation.messages.length;

  useEffect(() => {
    const node = scrollRef.current;
    if (node && messageCount >= 0) node.scrollTop = node.scrollHeight;
  }, [messageCount]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (text.length === 0) return;
    setDraft("");
    sendMessage(conversation.id, text);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center gap-3 border-b border-border px-5 py-4">
        <Avatar className="size-10 border border-border">
          <AvatarFallback className="bg-secondary text-sm font-semibold text-secondary-foreground">
            {conversation.participantInitials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-semibold text-foreground">
            {conversation.participantName}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {conversation.participantUniversity} · {conversation.subject}
          </p>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-5 py-6"
        data-ocid="messages.thread.panel"
      >
        {conversation.messages.map((message) => {
          const mine = message.sender === "me";
          return (
            <div
              key={message.id}
              className={cn("flex", mine ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm shadow-subtle",
                  mine
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm border border-border bg-card text-card-foreground",
                )}
              >
                <p className="whitespace-pre-wrap break-words">
                  {message.text}
                </p>
                <p
                  className={cn(
                    "mt-1 text-[11px]",
                    mine
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground",
                  )}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 border-t border-border px-5 py-4"
      >
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Type your message..."
          aria-label="Your message"
          data-ocid="messages.textarea"
          className="h-11"
        />
        <Button
          type="submit"
          size="icon"
          className="size-11 shrink-0"
          disabled={draft.trim().length === 0}
          aria-label="Send message"
          data-ocid="messages.submit_button"
        >
          <Send className="size-4" aria-hidden="true" />
        </Button>
      </form>
    </div>
  );
}
