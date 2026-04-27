import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    BorderStyle,
    TabStopType,
    Tab,
} from "docx";
import libreoffice from 'libreoffice-convert';

const COLORS = {
    PRIMARY: "1A56DB", // Blue
    TEXT: "1E293B",    // Dark Slate
    SECONDARY: "64748B", // Light Slate
    BG_LIGHT: "EFF6FF"  // Very Light Blue
};

const FONTS = {
    MAIN: "Calibri",
    TITLE: "Calibri"
};

const createSectionHeader = (text) => {
    return new Paragraph({
        children: [
            new TextRun({
                text: text.toUpperCase(),
                color: COLORS.PRIMARY,
                bold: true,
                size: 26, // 13pt
                font: FONTS.TITLE,
            }),
        ],
        border: {
            bottom: {
                color: COLORS.PRIMARY,
                space: 4,
                style: BorderStyle.SINGLE,
                size: 6,
            },
        },
        spacing: {
            before: 400,
            after: 200,
        },
    });
};

const createExperienceItem = (exp) => {
    const header = new Paragraph({
        children: [
            new TextRun({
                text: exp.role,
                bold: true,
                size: 23, // 11.5pt
                color: COLORS.TEXT,
                font: FONTS.MAIN,
            }),
            new TextRun({
                text: `   ·   `,
                color: COLORS.SECONDARY,
                font: FONTS.MAIN,
            }),
            new TextRun({
                text: exp.company,
                color: COLORS.PRIMARY,
                bold: true,
                size: 22, // 11pt
                font: FONTS.MAIN,
            }),
        ],
        spacing: { before: 200 },
    });

    const subheader = new Paragraph({
        children: [
            new TextRun({
                text: exp.period,
                italics: true,
                color: COLORS.SECONDARY,
                size: 19, // 9.5pt
                font: FONTS.MAIN,
            }),
        ],
        spacing: { after: 100 },
    });

    const bullets = exp.bullets.map(bullet =>
        new Paragraph({
            text: bullet,
            bullet: { level: 0 },
            spacing: { before: 100 },
            style: "normal"
        })
    );

    return [header, subheader, ...bullets];
};

const createSkillsParagraph = (title, items) => {
    const titlePara = new Paragraph({
        children: [
            new TextRun({
                text: title,
                bold: true,
                size: 21, // 10.5pt
                color: COLORS.TEXT,
                font: FONTS.MAIN,
            }),
        ],
        spacing: { before: 200, after: 100 },
    });

    const skillsPara = new Paragraph({
        children: items.flatMap((item, index) => [
            new TextRun({
                text: `  ${item}  `,
                shading: { fill: COLORS.BG_LIGHT },
                color: COLORS.PRIMARY,
                bold: true,
                size: 19, // 9.5pt
                font: FONTS.MAIN,
            }),
            new TextRun({
                text: "   ", // Space between skills
            }),
        ]),
        spacing: { after: 200 },
    });

    return [titlePara, skillsPara];
};

export const generateDocxFromJson = async (cvData) => {
    const {
        name,
        title,
        location,
        contact,
        profile,
        experience,
        education,
        skills,
        languages,
        additional
    } = cvData;

    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: 720,
                        right: 720,
                        bottom: 720,
                        left: 720,
                    },
                },
            },
            children: [
                // Header - Using TabStops for perfect alignment and stability
                new Paragraph({
                    tabStops: [{
                        type: TabStopType.RIGHT,
                        position: 9500, // Roughly the right margin
                    }],
                    children: [
                        new TextRun({
                            text: name,
                            bold: true,
                            size: 52, // 26pt
                            color: COLORS.TEXT,
                            font: FONTS.TITLE,
                        }),
                        new TextRun({ children: [new Tab()] }),
                        new TextRun({ text: `✉  ${contact.email}`, color: COLORS.SECONDARY, size: 19, font: FONTS.MAIN }),
                    ],
                }),
                new Paragraph({
                    tabStops: [{ type: TabStopType.RIGHT, position: 9500 }],
                    children: [
                        new TextRun({
                            text: title,
                            color: COLORS.PRIMARY,
                            bold: true,
                            size: 26, // 13pt
                            font: FONTS.MAIN,
                        }),
                        new TextRun({ children: [new Tab()] }),
                        new TextRun({ text: contact.github, color: COLORS.PRIMARY, size: 20, font: FONTS.MAIN, underline: {} }),
                    ],
                }),
                new Paragraph({
                    tabStops: [{ type: TabStopType.RIGHT, position: 9500 }],
                    children: [
                        new TextRun({
                            text: location,
                            color: COLORS.SECONDARY,
                            italics: true,
                            size: 19, // 9.5pt
                            font: FONTS.MAIN,
                        }),
                        new TextRun({ children: [new Tab()] }),
                        new TextRun({ text: contact.linkedin, color: COLORS.PRIMARY, size: 20, font: FONTS.MAIN, underline: {} }),
                    ],
                    spacing: { after: 200 },
                }),

                // Profile
                createSectionHeader("Perfil Profesional"),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: profile,
                            color: COLORS.SECONDARY,
                            size: 21, // 10.5pt
                            font: FONTS.MAIN,
                        }),
                    ],
                    spacing: { before: 100, after: 100 },
                }),

                // Experience
                createSectionHeader("Experiencia Profesional"),
                ...experience.flatMap(createExperienceItem),

                // Education
                createSectionHeader("Formación"),
                ...education.map(edu =>
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: edu.title,
                                bold: true,
                                size: 21,
                                color: COLORS.TEXT,
                                font: FONTS.MAIN,
                            }),
                            new TextRun({ text: "\n" }),
                            new TextRun({
                                text: ` ${edu.center}  ·  ${edu.location}`,
                                color: COLORS.SECONDARY,
                                italics: true,
                                size: 19,
                                font: FONTS.MAIN,
                            }),
                        ],
                        spacing: { before: 150, after: 150 },
                    })
                ),

                // Skills
                createSectionHeader("Habilidades Técnicas"),
                ...Object.entries(skills).flatMap(([key, items]) =>
                    createSkillsParagraph(key.charAt(0).toUpperCase() + key.slice(1), items)
                ),

                // Languages
                createSectionHeader("Idiomas"),
                ... (languages || []).map(lang =>
                    new Paragraph({
                        text: lang,
                        bullet: { level: 0 },
                        spacing: { before: 100 },
                        style: "normal"
                    })
                ),

                // Others
                createSectionHeader("Otros"),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: additional,
                            color: COLORS.TEXT,
                            size: 21,
                            font: FONTS.MAIN,
                        }),
                    ],
                    spacing: { before: 100 },
                }),
            ],
        }],
    });

    return await Packer.toBuffer(doc);
};

export async function convertDocxToPdf(docxBuffer) {
    return new Promise((resolve, reject) => {
        libreoffice.convert(docxBuffer, '.pdf', undefined, (err, done) => {
            if (err) return reject(err);
            resolve(done);
        });
    });
}
