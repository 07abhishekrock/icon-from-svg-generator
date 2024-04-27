import { InferType, object, string } from 'yup';

const validSchema = object({
	svgDirectory: string().required(),
	targetFontDirectory: string().required(),
	fontName: string().required(),
	htmlPath: string().notRequired(),
});

export type FONT_GENERATE_CONFIG = InferType<typeof validSchema>;
