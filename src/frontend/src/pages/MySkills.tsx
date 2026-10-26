import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { SKILL_CATEGORIES } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import type { Skill, SkillCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { GraduationCap, Lightbulb, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type SkillIntent = "teach" | "learn";

const LEVELS: Skill["level"][] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
];

const LEVEL_STYLES: Record<string, string> = {
  Beginner: "border-success/40 bg-success/10 text-success",
  Intermediate: "border-accent/40 bg-accent/10 text-accent-foreground",
  Advanced: "border-secondary/40 bg-secondary/10 text-secondary",
  Expert: "border-primary/40 bg-primary/10 text-primary",
  Débutant: "border-success/40 bg-success/10 text-success",
  Intermédiaire: "border-accent/40 bg-accent/10 text-accent-foreground",
  Avancé: "border-secondary/40 bg-secondary/10 text-secondary",
};

interface SkillFormState {
  name: string;
  category: SkillCategory;
  level: Skill["level"];
  description: string;
}

const EMPTY_FORM: SkillFormState = {
  name: "",
  category: "Programming",
  level: "Intermediate",
  description: "",
};

export function MySkillsPage() {
  const { profile, updateProfile } = useStore();
  const [activeTab, setActiveTab] = useState<SkillIntent>("teach");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SkillFormState>(EMPTY_FORM);
  const [pendingRemoval, setPendingRemoval] = useState<Skill | null>(null);

  const skills =
    activeTab === "teach" ? profile.skillsOffered : profile.skillsWanted;

  function openAddForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEditForm(skill: Skill) {
    setEditingId(skill.id);
    setForm({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      description: skill.description,
    });
    setFormOpen(true);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = form.name.trim();
    if (name.length === 0) return;

    const nextSkill: Skill = {
      id: editingId ?? `sk-${Date.now()}`,
      name,
      category: form.category,
      level: form.level,
      description: form.description.trim(),
    };

    if (editingId) {
      updateProfile({
        skillsOffered: profile.skillsOffered.map((skill) =>
          skill.id === editingId ? nextSkill : skill,
        ),
        skillsWanted: profile.skillsWanted.map((skill) =>
          skill.id === editingId ? nextSkill : skill,
        ),
      });
      toast.success("Skill updated successfully");
    } else {
      updateProfile({
        skillsOffered:
          activeTab === "teach"
            ? [...profile.skillsOffered, nextSkill]
            : profile.skillsOffered,
        skillsWanted:
          activeTab === "learn"
            ? [...profile.skillsWanted, nextSkill]
            : profile.skillsWanted,
      });
      toast.success("Skill added successfully");
    }

    setFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function handleRemove() {
    if (!pendingRemoval) return;
    updateProfile({
      skillsOffered: profile.skillsOffered.filter(
        (skill) => skill.id !== pendingRemoval.id,
      ),
      skillsWanted: profile.skillsWanted.filter(
        (skill) => skill.id !== pendingRemoval.id,
      ),
    });
    toast.success("Skill removed from your profile");
    setPendingRemoval(null);
  }

  return (
    <section className="container py-12 md:py-16" data-ocid="my_skills.page">
      <div className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="label-eyebrow">Skills Management</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            What I Teach, What I Learn
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Manage the topics you offer for peer tutoring and the competencies
            you are eager to acquire from student mentors.
          </p>
        </div>
        <Button
          type="button"
          onClick={openAddForm}
          data-ocid="my_skills.add_button"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add a Skill
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as SkillIntent)}
        className="mt-10"
        data-ocid="my_skills.tabs"
      >
        <TabsList className="h-auto w-full justify-start gap-1 rounded-lg border border-border bg-muted p-1 sm:w-auto">
          <TabsTrigger
            value="teach"
            className="gap-2 rounded-md px-4 py-2"
            data-ocid="my_skills.teach.tab"
          >
            <GraduationCap className="size-4" aria-hidden="true" />
            Skills I Teach
            <span className="text-xs text-muted-foreground">
              {profile.skillsOffered.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="learn"
            className="gap-2 rounded-md px-4 py-2"
            data-ocid="my_skills.learn.tab"
          >
            <Lightbulb className="size-4" aria-hidden="true" />
            Skills I Want to Learn
            <span className="text-xs text-muted-foreground">
              {profile.skillsWanted.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-8">
          {skills.length === 0 ? (
            <Card
              className="rounded-lg border-dashed border-border py-16 shadow-none"
              data-ocid="my_skills.empty_state"
            >
              <CardContent className="flex flex-col items-center gap-4 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  {activeTab === "teach" ? (
                    <GraduationCap className="size-6" aria-hidden="true" />
                  ) : (
                    <Lightbulb className="size-6" aria-hidden="true" />
                  )}
                </span>
                <div>
                  <p className="font-display text-xl font-semibold">
                    {activeTab === "teach"
                      ? "You haven't listed any teaching skills yet"
                      : "You haven't added any learning goals yet"}
                  </p>
                  <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                    {activeTab === "teach"
                      ? "Share what you know to unlock matching peer requests across campus."
                      : "Add subjects you'd like to explore to receive personalized peer recommendations."}
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={openAddForm}
                  data-ocid="my_skills.empty_button"
                >
                  <Plus className="size-4" aria-hidden="true" />
                  Add a Skill
                </Button>
              </CardContent>
            </Card>
          ) : (
            <ul
              className="grid gap-4 md:grid-cols-2"
              data-ocid="my_skills.list"
            >
              {skills.map((skill, index) => (
                <li key={skill.id}>
                  <Card
                    className="h-full gap-4 rounded-lg border-border py-5 shadow-subtle transition-smooth hover:shadow-elevated"
                    data-ocid={`my_skills.item.${index + 1}`}
                  >
                    <CardHeader className="px-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <CardTitle className="font-display text-lg">
                            {skill.name}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {skill.category}
                          </CardDescription>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-9"
                            aria-label={`Edit ${skill.name}`}
                            onClick={() => openEditForm(skill)}
                            data-ocid={`my_skills.edit_button.${index + 1}`}
                          >
                            <Pencil className="size-4" aria-hidden="true" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-9 text-muted-foreground hover:text-destructive"
                            aria-label={`Delete ${skill.name}`}
                            onClick={() => setPendingRemoval(skill)}
                            data-ocid={`my_skills.delete_button.${index + 1}`}
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 px-5">
                      <p className="text-sm text-muted-foreground">
                        {skill.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className="rounded-full border-border bg-muted text-muted-foreground"
                        >
                          {skill.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-full",
                            LEVEL_STYLES[skill.level] ||
                              "bg-primary/10 text-primary",
                          )}
                        >
                          {skill.level}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent data-ocid="my_skills.dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {editingId ? "Edit Skill" : "Add a Skill"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update your proficiency level or description for this topic."
                : activeTab === "teach"
                  ? "Describe a subject you can teach and mentor peers on."
                  : "Specify a subject you are eager to learn from another student."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="skill-name">Skill Name</Label>
              <Input
                id="skill-name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="e.g. Distributed Systems in Go, Figma UI Design"
                required
                data-ocid="my_skills.name_input"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="skill-category">Academic Discipline</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      category: value as SkillCategory,
                    }))
                  }
                >
                  <SelectTrigger
                    id="skill-category"
                    data-ocid="my_skills.category_select"
                  >
                    <SelectValue placeholder="Select discipline" />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="skill-level">Proficiency Level</Label>
                <Select
                  value={form.level}
                  onValueChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      level: value as Skill["level"],
                    }))
                  }
                >
                  <SelectTrigger
                    id="skill-level"
                    data-ocid="my_skills.level_select"
                  >
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="skill-description">
                Description & Focus Areas
              </Label>
              <Textarea
                id="skill-description"
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Briefly describe what you can teach or what topics you want help with."
                rows={3}
                data-ocid="my_skills.description_textarea"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
                data-ocid="my_skills.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.name.trim().length === 0}
                data-ocid="my_skills.submit_button"
              >
                {editingId ? "Save Changes" : "Add Skill"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={pendingRemoval !== null}
        onOpenChange={(open) => {
          if (!open) setPendingRemoval(null);
        }}
      >
        <AlertDialogContent data-ocid="my_skills.confirm_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">
              Remove this Skill?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingRemoval
                ? `"${pendingRemoval.name}" will be removed from your profile.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="my_skills.confirm_cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="my_skills.confirm_button"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
