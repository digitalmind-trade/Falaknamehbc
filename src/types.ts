export interface PlanetPlacement {
  name: string;
  symbol: string;
  sign: string;
  signSymbol: string;
  degree: string;
  house: string;
  isRetrograde?: boolean;
}

export interface NatalChartInput {
  birthDateFa: string;
  birthDateEn: string;
  birthTime: string;
  birthLocation: string;
  planets: PlanetPlacement[];
  ascendant: {
    sign: string;
    signSymbol: string;
    degree: string;
  };
  mc: {
    sign: string;
    signSymbol: string;
    degree: string;
  };
  elements: {
    air: string;
    earth: string;
    water: string;
    fire: string;
    summary: string;
  };
  qualities: {
    cardinal: string;
    fixed: string;
    mutable: string;
    summary: string;
  };
  aspects: string[];
  keyPlanets: string[];
  transitPeriod: string; // e.g., "مرداد تا پایان اسفند ۱۴۰۵"
  targetWordCount: number; // e.g., 3800
  additionalInstructions?: string;
  rawHtmlContent?: string;
}

export interface SectionContent {
  sectionNumber: number;
  titleFa: string;
  titleEn: string;
  contentMarkdown: string;
}

export interface GeneratedReport {
  id: string;
  createdAt: string;
  chartInput: NatalChartInput;
  sections: SectionContent[];
  fullText: string;
  finalHtml: string;
  totalWordCount: number;
}
