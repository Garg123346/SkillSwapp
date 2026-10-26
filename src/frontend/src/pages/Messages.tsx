import { ChatPane, ConversationRow } from "@/components/messages/ChatPane";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { MessageSquare, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function MessagesPage() {
  const { conversations, markConversationRead } = useStore();
  const [activeId, setActiveId] = useState<string | null>(
    conversations[0]?.id ?? null,
  );
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (term.length === 0) return conversations;
    return conversations.filter(
      (conversation) =>
        conversation.participantName.toLowerCase().includes(term) ||
        conversation.subject.toLowerCase().includes(term),
    );
  }, [conversations, query]);

  const activeConversation =
    conversations.find((conversation) => conversation.id === activeId) ?? null;

  useEffect(() => {
    if (activeId) markConversationRead(activeId);
  }, [activeId, markConversationRead]);

  const totalUnread = conversations.reduce(
    (sum, conversation) => sum + conversation.unreadCount,
    0,
  );

  return (
    <section className="container py-12 md:py-16" data-ocid="messages.page">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-eyebrow">Direct Messaging</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Messages
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Connect with your mentors and mentees, schedule peer learning
            sessions, and keep track of your conversations.
          </p>
        </div>
        {totalUnread > 0 && (
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{totalUnread}</span>{" "}
            unread message{totalUnread > 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <aside
          className="flex flex-col rounded-xl border border-border bg-card shadow-subtle"
          data-ocid="messages.list.panel"
        >
          <div className="border-b border-border p-4">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search conversations..."
                aria-label="Search conversations"
                data-ocid="messages.search_input"
                className="pl-9"
              />
            </div>
          </div>

          <div className="max-h-[32rem] flex-1 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <div
                className="flex flex-col items-center gap-2 px-4 py-12 text-center"
                data-ocid="messages.empty_state"
              >
                <MessageSquare
                  className="size-8 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="text-sm font-medium text-foreground">
                  No conversations found
                </p>
                <p className="text-xs text-muted-foreground">
                  Try searching with a different name or subject.
                </p>
              </div>
            ) : (
              filtered.map((conversation) => (
                <ConversationRow
                  key={conversation.id}
                  conversation={conversation}
                  active={conversation.id === activeId}
                  onSelect={() => setActiveId(conversation.id)}
                />
              ))
            )}
          </div>
        </aside>

        <div
          className="flex min-h-[36rem] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-subtle"
          data-ocid="messages.chat.panel"
        >
          {activeConversation ? (
            <ChatPane
              key={activeConversation.id}
              conversation={activeConversation}
            />
          ) : (
            <div
              className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center"
              data-ocid="messages.chat.empty_state"
            >
              <MessageSquare
                className="size-10 text-muted-foreground"
                aria-hidden="true"
              />
              <p className="font-display text-xl font-semibold text-foreground">
                Select a conversation
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Choose a conversation from the sidebar to view exchange history
                and reply in real time.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
