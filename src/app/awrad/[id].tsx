import { useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";
import { WardForm, type WardValues } from "@/components/ward-form";
import { Txt } from "@/components/txt";
import { useAdhkariCategories, useCustomAwrad, useCustomCategories } from "@/store/store";

export default function EditWard() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { list, update, remove } = useCustomAwrad();
  const categories = useAdhkariCategories();
  const { add: addCategory } = useCustomCategories();
  const ward = list.find((w) => w.id === id);

  if (!ward) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Txt size={18} weight="semibold">لم يُعثر على الذِكر</Txt>
      </View>
    );
  }

  function handleSubmit(values: WardValues) {
    update(ward!.id, values);
    router.back();
  }

  function handleDelete() {
    remove(ward!.id);
    router.back();
  }

  return (
    <WardForm
      heading="تعديل الذِكر"
      submitLabel="حفظ التعديلات"
      categories={categories}
      onCreateCategory={addCategory}
      initial={{ title: ward.title, text: ward.text, count: ward.count, category: ward.category }}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
      onDelete={handleDelete}
    />
  );
}
