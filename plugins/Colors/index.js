module.exports = function(wall, app) {

    var colors = {
        // Pink colors
        Pink: { r: 255, g: 192, b: 203 },
        LightPink: { r: 255, g: 182, b: 193 },
        HotPink: { r: 255, g: 105, b: 180 },
        DeepPink: { r: 255, g:  20, b: 147 },
        PaleVioletRed: { r: 219, g: 112, b: 147 },
        MediumVioletRed: { r: 199, g:  21, b: 133 },

        // Red colors
        LightSalmon: { r: 255, g: 160, b: 122 },
        Salmon: { r: 250, g: 128, b: 114 },
        DarkSalmon: { r: 233, g: 150, b: 122 },
        LightCoral: { r: 240, g: 128, b: 128 },
        IndianRed: { r: 205, g:  92, b:  92 },
        Crimson: { r: 220, g:  20, b:  60 },
        FireBrick: { r: 178, g:  34, b:  34 },
        DarkRed: { r: 139, g:   0, b:   0 },
        Red: { r: 255, g:   0, b:   0 },

        // Orange colors
        OrangeRed: { r: 255, g:  69, b:   0 },
        Tomato: { r: 255, g:  99, b:  71 },
        Coral: { r: 255, g: 127, b:  80 },
        DarkOrange: { r: 255, g: 140, b:   0 },
        Orange: { r: 255, g: 165, b:   0 },

        // Yellow colors
        Yellow: { r: 255, g: 255, b:   0 },
        LightYellow: { r: 255, g: 255, b: 224 },
        LemonChiffon: { r: 255, g: 250, b: 205 },
        LightGoldenrodYellow: { r: 250, g: 250, b: 210 },
        PapayaWhip: { r: 255, g: 239, b: 213 },
        Moccasin: { r: 255, g: 228, b: 181 },
        PeachPuff: { r: 255, g: 218, b: 185 },
        PaleGoldenrod: { r: 238, g: 232, b: 170 },
        Khaki: { r: 240, g: 230, b: 140 },
        DarkKhaki: { r: 189, g: 183, b: 107 },
        Gold: { r: 255, g: 215, b:   0 },

        // Brown colors
        Cornsilk: { r: 255, g: 248, b: 220 },
        BlanchedAlmond: { r: 255, g: 235, b: 205 },
        Bisque: { r: 255, g: 228, b: 196 },
        NavajoWhite: { r: 255, g: 222, b: 173 },
        Wheat: { r: 245, g: 222, b: 179 },
        BurlyWood: { r: 222, g: 184, b: 135 },
        Tan: { r: 210, g: 180, b: 140 },
        RosyBrown: { r: 188, g: 143, b: 143 },
        SandyBrown: { r: 244, g: 164, b:  96 },
        Goldenrod: { r: 218, g: 165, b:  32 },
        DarkGoldenrod: { r: 184, g: 134, b:  11 },
        Peru: { r: 205, g: 133, b:  63 },
        Chocolate: { r: 210, g: 105, b:  30 },
        SaddleBrown: { r: 139, g:  69, b:  19 },
        Sienna: { r: 160, g:  82, b:  45 },
        Brown: { r: 165, g:  42, b:  42 },
        Maroon: { r: 128, g:   0, b:   0 },

        // Green colors
        DarkOliveGreen: { r:  85, g: 107, b:  47 },
        Olive: { r: 128, g: 128, b:   0 },
        OliveDrab: { r: 107, g: 142, b:  35 },
        YellowGreen: { r: 154, g: 205, b:  50 },
        LimeGreen: { r:  50, g: 205, b:  50 },
        Lime: { r:   0, g: 255, b:   0 },
        LawnGreen: { r: 124, g: 252, b:   0 },
        Chartreuse: { r: 127, g: 255, b:   0 },
        GreenYellow: { r: 173, g: 255, b:  47 },
        SpringGreen: { r:   0, g: 255, b: 127 },
        MediumSpringGreen: { r:   0, g: 250, b: 154 },
        LightGreen: { r: 144, g: 238, b: 144 },
        PaleGreen: { r: 152, g: 251, b: 152 },
        DarkSeaGreen: { r: 143, g: 188, b: 143 },
        MediumAquamarine: { r: 102, g: 205, b: 170 },
        MediumSeaGreen: { r:  60, g: 179, b: 113 },
        SeaGreen: { r:  46, g: 139, b:  87 },
        ForestGreen: { r:  34, g: 139, b:  34 },
        Green: { r:   0, g: 128, b:   0 },
        DarkGreen: { r:   0, g: 100, b:   0 },

        // Cyan colors
        Aqua: { r:   0, g: 255, b: 255 },
        Cyan: { r:   0, g: 255, b: 255 },
        LightCyan: { r: 224, g: 255, b: 255 },
        PaleTurquoise: { r: 175, g: 238, b: 238 },
        Aquamarine: { r: 127, g: 255, b: 212 },
        Turquoise: { r:  64, g: 224, b: 208 },
        MediumTurquoise: { r:  72, g: 209, b: 204 },
        DarkTurquoise: { r:   0, g: 206, b: 209 },
        LightSeaGreen: { r:  32, g: 178, b: 170 },
        CadetBlue: { r:  95, g: 158, b: 160 },
        DarkCyan: { r:   0, g: 139, b: 139 },
        Teal: { r:   0, g: 128, b: 128 },

        // Blue colors
        LightSteelBlue: { r: 176, g: 196, b: 222 },
        PowderBlue: { r: 176, g: 224, b: 230 },
        LightBlue: { r: 173, g: 216, b: 230 },
        SkyBlue: { r: 135, g: 206, b: 235 },
        LightSkyBlue: { r: 135, g: 206, b: 250 },
        DeepSkyBlue: { r:   0, g: 191, b: 255 },
        DodgerBlue: { r:  30, g: 144, b: 255 },
        CornflowerBlue: { r: 100, g: 149, b: 237 },
        SteelBlue: { r:  70, g: 130, b: 180 },
        RoyalBlue: { r:  65, g: 105, b: 225 },
        Blue: { r:   0, g:   0, b: 255 },
        MediumBlue: { r:   0, g:   0, b: 205 },
        DarkBlue: { r:   0, g:   0, b: 139 },
        Navy: { r:   0, g:   0, b: 128 },
        MidnightBlue: { r:  25, g:  25, b: 112 },

        // Purple, violet, and magenta colors
        Lavender: { r: 230, g: 230, b: 250 },
        Thistle: { r: 216, g: 191, b: 216 },
        Plum: { r: 221, g: 160, b: 221 },
        Violet: { r: 238, g: 130, b: 238 },
        Orchid: { r: 218, g: 112, b: 214 },
        Fuchsia: { r: 255, g:   0, b: 255 },
        Magenta: { r: 255, g:   0, b: 255 },
        MediumOrchid: { r: 186, g:  85, b: 211 },
        MediumPurple: { r: 147, g: 112, b: 219 },
        BlueViolet: { r: 138, g:  43, b: 226 },
        DarkViolet: { r: 148, g:   0, b: 211 },
        DarkOrchid: { r: 153, g:  50, b: 204 },
        DarkMagenta: { r: 139, g:   0, b: 139 },
        Purple: { r: 128, g:   0, b: 128 },
        Indigo: { r:  75, g:   0, b: 130 },
        DarkSlateBlue: { r:  72, g:  61, b: 139 },
        SlateBlue: { r: 106, g:  90, b: 205 },
        MediumSlateBlue: { r: 123, g: 104, b: 238 },

        // White colors
        White: { r: 255, g: 255, b: 255 },
        Snow: { r: 255, g: 250, b: 250 },
        Honeydew: { r: 240, g: 255, b: 240 },
        MintCream: { r: 245, g: 255, b: 250 },
        Azure: { r: 240, g: 255, b: 255 },
        AliceBlue: { r: 240, g: 248, b: 255 },
        GhostWhite: { r: 248, g: 248, b: 255 },
        WhiteSmoke: { r: 245, g: 245, b: 245 },
        Seashell: { r: 255, g: 245, b: 238 },
        Beige: { r: 245, g: 245, b: 220 },
        OldLace: { r: 253, g: 245, b: 230 },
        FloralWhite: { r: 255, g: 250, b: 240 },
        Ivory: { r: 255, g: 255, b: 240 },
        AntiqueWhite: { r: 250, g: 235, b: 215 },
        Linen: { r: 250, g: 240, b: 230 },
        LavenderBlush: { r: 255, g: 240, b: 245 },
        MistyRose: { r: 255, g: 228, b: 225 },

        // Gray and black colors
        Gainsboro: { r: 220, g: 220, b: 220 },
        LightGray: { r: 211, g: 211, b: 211 },
        Silver: { r: 192, g: 192, b: 192 },
        DarkGray: { r: 169, g: 169, b: 169 },
        Gray: { r: 128, g: 128, b: 128 },
        DimGray: { r: 105, g: 105, b: 105 },
        LightSlateGray: { r: 119, g: 136, b: 153 },
        SlateGray: { r: 112, g: 128, b: 144 },
        DarkSlateGray: { r:  47, g:  79, b:  79 },
        Black: { r:   0, g:   0, b:   0 }
    };

    colors.fromHEX = function(hex) {
        if(typeof hex !== 'string') {
            return colors.Black;
        }
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : colors.Black;
    }

    wall.public.color = colors;
    return colors;
};
