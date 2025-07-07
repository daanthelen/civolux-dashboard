export class Color {
  private constructor(public hue: number, public saturation: number, public lightness: number) {}

  public static fromHsl(hue: number, saturation: number, lightness: number): Color {
    return new Color(hue, saturation, lightness);
  }

  public toHslString(): string {
    return `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
  }
}

export class ColorPaletteGenerator {
  private readonly fixedSaturation = 77;
  private readonly fixedLightness = 52;
  private readonly generatedColors: Map<number, Color> = new Map();

  public getColor(index: number): Color {
    if (this.generatedColors.has(index)) {
      return this.generatedColors.get(index)!;
    }

    const hue = (index * 137.5) % 360;

    const newColor = Color.fromHsl(hue, this.fixedSaturation, this.fixedLightness);
    this.generatedColors.set(index, newColor);
    return newColor;
  }

  public generateColors(count: number): Color[] {
    const colors: Color[] = [];
    for (let i = 0; i < count; i++) {
      colors.push(this.getColor(i));
    }
    return colors;
  }

  public reset(): void {
    this.generatedColors.clear();
  }
}