import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@weed-ui/dialog";
import { Button } from "@weed-ui/button";

export default function Demo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>组件归你了</DialogTitle>
          <DialogDescription>
            源码复制进你的仓库之后，我们不再有任何关系——这正是分发哲学本身。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button variant="default">Accept</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
