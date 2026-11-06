import { Tabs, TabsContent, TabsList, TabsTrigger } from "@weed-ui/tabs";

export default function Demo() {
  return (
    <Tabs defaultValue="tokens">
      <TabsList>
        <TabsTrigger value="tokens">tokens</TabsTrigger>
        <TabsTrigger value="components">components</TabsTrigger>
        <TabsTrigger value="registry">registry</TabsTrigger>
      </TabsList>
      <TabsContent value="tokens">
        OKLCH 三档：primitive → semantic → component，双主题。
      </TabsContent>
      <TabsContent value="components">
        首发 10+1，签名组件 BlueprintGrid。
      </TabsContent>
      <TabsContent value="registry">
        npx shadcn add @weed-ui/button
      </TabsContent>
    </Tabs>
  );
}
