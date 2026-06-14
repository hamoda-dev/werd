import type { ReactNode } from "react";
import { ScrollView, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { gradients, semantic, spacing } from "@/theme/tokens";

interface Props {
  children: ReactNode;
  /** Which background gradient to paint. */
  gradient?: keyof typeof gradients;
  /** Scroll the content (default) or render a padded fixed View. */
  scroll?: boolean;
  /** Override/extend the content container padding (e.g. edge-to-edge headers). */
  contentStyle?: ViewStyle;
}

/** Screen scaffold: gradient background + safe-area + standard padding (scroll or fixed). */
export function Screen({ children, gradient = "darkScreen", scroll = true, contentStyle }: Props) {
  const insets = useSafeAreaInsets();
  const content: ViewStyle = {
    paddingTop: insets.top + spacing.lg,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: semantic.screen,
        experimental_backgroundImage: gradients[gradient],
      }}
    >
      {scroll ? (
        <ScrollView contentContainerStyle={[content, contentStyle]} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, content, { paddingBottom: insets.bottom + spacing.xxl }, contentStyle]}>
          {children}
        </View>
      )}
    </View>
  );
}
