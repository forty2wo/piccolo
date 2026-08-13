#!/usr/bin/env python3
"""Fix all series descriptions in products-data.json:
1. Write proper Chinese descriptions for 26 series missing them
2. Clean up English descriptions (remove tech dumps, fix truncation)
3. Add descriptionEn field where missing
"""
import json
import os

JSON_PATH = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'lib', 'products-data.json')

with open(JSON_PATH, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Maps by collection name
FIXES = {
    "Chicco": {
        "description": "奇科系列灵感源自意大利威尼斯手工砖传统——一种跨越社会阶层的材质语言。从米兰资产阶级公寓的门厅到博洛尼亚柱廊的人行道，从乡村住宅到小学地板，手工砖无处不在。系列提供 Greige（灰褐）、Verde（绿）、Senape（芥末）、Rosa（玫瑰）、Cacao（可可）五种色调，三款网贴花砖设计，可灵活适配多种空间需求。",
        "descriptionEn": "The Chicco Collection draws from an all-Italian story: the Venetian handcrafted tile. A material present across society—from Milanese residential entrances to Bologna's porticoes. Five colors (Greige, Verde, Senape, Rosa, Cacao) and three mesh-mounted designs offer versatile pattern combinations."
    },
    "Stories": {
        "description": "故事系列是10×10cm瓷质砖的拼图叙事。Dance、Eddie、Caravan、Costiera 四个故事如同同一本书的四个篇章，每篇以哑光或亮光白底为起点，在方寸之间展开想象。系列支持多种花砖搭配，像拼图一样组合出属于你的空间故事。",
        "descriptionEn": "A collection of porcelain tales in 10×10cm tiles that come together like puzzle pieces. Dance, Eddie, Caravan, and Costiera—four stories from the same book, each beginning on a matte or glossy white base."
    },
    "Brutus": {
        "description": "布鲁特斯系列是一场关于粗野主义美学的风格探索——欧洲粗野主义与南美粗犷风格的对话。系列包含花岗岩效果砖面（自然面与粗犷面两种选择），搭配危地马拉大理石效果砖及名为 Cromo 的小尺寸亮面银色砖。在粗粝材质与精致细节之间，在哑光表面与光泽反射之间，Brutus 诠释了对比的力量。",
        "descriptionEn": "A stylistic exploration highlighting contrasts between European Brutalist and South American aesthetics. Granite-effect surfaces in natural and rugged finishes pair with Guatemala marble-effect and Cromo—a small glossy silver format. Brutus embodies the tension between raw materiality and precious detail."
    },
    "Nok": {
        "description": "诺克系列灵感来自一间巴黎公寓——墙上挂着新表现主义画作，酒店在现代主义与原生艺术之间徘徊，非洲是逃逸的念头。系列以强烈材质感的瓷质砖呈现，拥有不同的泥土质感结构。Ivory（象牙白）、Toupe（灰褐）、Ebony（乌木）、Terra（陶土）四种色调，如阳光在一天不同时刻照射粘土大地般温暖明亮。Snake 和 Totem 两款装饰花砖融入部落与几何图案，Boogie、Crock、Rug 三款马赛克各具个性，共同构成材质与思想间的身份对话。",
        "descriptionEn": "Inspired by a Parisian apartment with neo-expressionist walls and a hotel between modernism and Art Brut. Nok is porcelain stoneware with strong material taste and earthy structures. Four warm colors—Ivory, Toupe, Ebony, Terra—like sunlight on clayish ground through different hours. Snake and Totem decorations add tribal and geometric patterns, while three mosaics (Boogie, Crock, Rug) complete the collection."
    },
    "Mou": {
        "description": "慕系列以柔软触感和手工质感为核心特征。白坯单烧墙砖工艺，表面呈现细腻的不规则起伏，呼应手工制品的温度。每片瓷砖的色调和尺寸均有细微差异，这是对工艺特性的尊重而非瑕疵。安装时建议使用合规粘合剂，潮湿环境需做好防水处理。",
        "descriptionEn": "Mou is defined by its soft touch and artisanal character. White body single-fired wall tiles with delicate surface irregularities that celebrate craftsmanship. Slight variations in tone and caliber are inherent to the product's artisanal nature."
    },
    "Pixel41": {
        "description": "像素41系列以手工质感为设计核心。边缘的不规则、平整度的细微变化、圆角处理和有质感的表面，共同营造出手工制品般的视觉效果。釉面颜色会随光线角度呈现不同的通透感。系列色彩遵循 NCS 自然色系标准，建议 3-4mm 留缝铺贴以保留自然韵味。",
        "descriptionEn": "Pixel41 is defined by its handcrafted look—edge irregularities, variable flatness, rounded corners, and textured surface. Glaze opacity shifts with the light angle. Colors follow the NCS scale. A 3-4mm joint is recommended to preserve the natural character."
    },
    "Spectre": {
        "description": "幻影系列是光与色的棱镜实验。每片砖面呈现黄绿、蓝绿、黄橙、粉紫到金属蓝的渐变色调，随观看角度和光线变化而流转。建议将全息砖与哑光和亮光砖混合铺贴，使用白水泥填缝，避免使用酸性清洁剂或研磨海绵。",
        "descriptionEn": "Spectre is a prism experiment in light and color. Each piece shifts through yellow/green, blue/green, pink/fuchsia to metallic blue depending on viewing angle and light. Hologram pieces should be mixed between matte and glossy finishes. White cement grout recommended."
    },
    "Biscuit": {
        "description": "饼干系列以 5×20cm 小尺寸砖为载体，提供 Bordeaux（酒红）、Terra（陶土）、Powder（粉调）、Bianco（白）、Salvia（鼠尾草绿）、Notte（夜色）六种低调色调。以极简的元素创造出令人惊叹的空间效果，系列涵盖多款花砖图案，可自由组合搭配。",
        "descriptionEn": "Biscuit offers 5×20cm tiles in six dusty colours—Bordeaux, Terra, Powder, Bianco, Salvia, and Notte. A collection that astounds through the simplicity of its elements, with multiple pattern designs for creative combinations."
    },
    "Futura": {
        "description": "未来系列具有强烈的视觉冲击力，是多种概念演进的产物。灵感来自20世纪上半叶艺术与建筑流派的代表人物——从包豪斯到皮埃尔·夏罗的玻璃之家，从垮掉的一代到赛博风格。系列以传统手工水泥花砖为灵感起点，通过半工业工艺刻意营造出手工制品般的质感——平整度与直角度的细微变化、釉面上的微小不规则，都是这种工艺美学的体现。",
        "descriptionEn": "Futura is a collection with strong visual impact, evolving from the artistic and architectural currents of the early 20th century—from Bauhaus to Pierre Chareau's Maison de Verre, from beat generation to cyber style. Inspired by handmade cementine tiles, a semi-industrial process deliberately creates artisanal perceptions through subtle variations in flatness and surface irregularities."
    },
    "Paper41 Pro": {
        "description": "纸41专业系列将当代壁画艺术移植到超薄瓷板上。3.5mm 厚度的柔性瓷质砖面板，成为装饰与设计的新载体。形状、色彩与情感在极薄的陶瓷板上诞生，视觉的冲击力唤起遥远而迷人的氛围。系列包含 Flora（花卉）和 Luz（光）等图案主题，每款都是一幅独立的陶瓷壁画。",
        "descriptionEn": "Paper41 Pro translates contemporary fresco art onto ultra-thin ceramic plates. At just 3.5mm thick, these flexible panels become a new medium for decoration and design. Shapes, colors and emotions come alive on extremely thin ceramic, evoking distant and fascinating atmospheres. Includes Flora and Luz pattern themes."
    },
    "Biolith": {
        "description": "生物岩系列是创新的生物基表面材料，由天然粘土、精选砂和植物纤维组成。不含水泥、合成粘合剂和挥发性有机化合物（VOC），具备出色的弹性、透气性和吸湿调节能力。系列代表了对可持续建材的前沿探索，适合追求健康室内环境的住宅与商业空间。",
        "descriptionEn": "Biolith is an innovative bio-based surface material composed of natural clays, selected sands, and plant fibers. Free from cements, synthetic binders, and VOCs, it offers exceptional elasticity, breathability, and hygroscopic regulation capabilities."
    },
    "Beat": {
        "description": "节拍系列灵感来自时间的流逝与事物的节律划痕——从播种田地的犁沟到建筑外立面，从水面的涟漪到雪地上的足迹。Seed（种子）、Snow（雪）、Rain（雨）、Ash（灰烬）四种色调，将时间的刻痕转化为瓷砖表面的纹理语言。",
        "descriptionEn": "Beat originates from an exploration of the passage of time and the rhythmic scanning of surfaces produced by man and nature—from furrows in a seeded field to building facades, from rippling water to footprints in snow. Four tones: Seed, Snow, Rain, Ash."
    },
    "Firenze": {
        "description": "佛罗伦萨系列由 Rodolfo Dordoni 设计，从佛罗伦萨传统的精致氛围中汲取灵感。柔和的色调与天鹅绒般的质感，唤起一段穿越意大利历史的旅程，以当代工艺重新诠释经典。系列适合追求优雅与文化底蕴的空间设计。",
        "descriptionEn": "Designed by Rodolfo Dordoni, the Firenze collection draws inspiration from the refined atmospheres of Florentine tradition. Soft tones and velvety textures evoke a journey through Italian history, reinterpreted with contemporary craftsmanship."
    },
    "Matera": {
        "description": "马泰拉系列灵感来自被阳光笼罩的岩石——那种在岁月中自然成形的石头，为家居空间注入原始而温暖的氛围。系列以彩色耐火粘土手工制作，每片瓷砖都拥有独特的纹理与色调变化，呈现完美的和谐与平衡，等待被探索。",
        "descriptionEn": "Matera draws from sun-shrouded stone that has taken shape over millennia, bringing a primal warmth to living spaces. Handcrafted with colored refractory clays, each tile possesses unique texture and tone variations—a perfect, balanced harmony waiting to be explored."
    },
    "Mediterranea": {
        "description": "地中海系列唤起地中海陶土的永恒之美，以当代表面重新诠释传统。Lanzarote（兰萨罗特）等色调呈现柔和的纹理与自然的色调，讲述真实材质与手工灵魂的故事，而 NeoClay™ 技术则守护这份美丽历久弥新。",
        "descriptionEn": "Mediterranea evokes the timeless beauty of Mediterranean terracotta, reinterpreting it in contemporary surfaces. Soft textures and natural tones tell the story of authentic material and artisanal soul, while NeoClay™ technology preserves this beauty over time."
    },
    "Murano": {
        "description": "穆拉诺系列如同一幅悬于水天之间的画布，捕捉威尼斯潟湖的无限色调。光与水交融的瞬间，每条线条都消融在液态光线的马赛克中。系列以手工陶瓷表面呈现潟湖般的色彩反射——Laguna Chiaro（浅潟湖）与 Laguna Scuro（深潟湖），将威尼斯的光影魔法带入空间。",
        "descriptionEn": "Murano is a canvas suspended between water and sky, capturing the infinite nuances of the Venetian lagoon. Where light and water merge, every line dissolves into a mosaic of liquid light. Handcrafted ceramic surfaces translate the lagoon's reflective magic into living spaces."
    },
    "Pantelleria": {
        "description": "潘泰莱里亚系列是原始材质的表达。火山岛的大地、岩浆岩、凝灰岩和珍贵的黑曜石——光与影的强烈不和谐、沉默的神秘、大海的魔力——共同构成这款瓷砖的材质基因。系列以火山岛的粗犷与神秘为灵感，适合追求强烈空间个性的设计。",
        "descriptionEn": "Pantelleria is primordial matter—volcanic earth, magmatic rocks, tuff, and precious obsidian. The powerful dissonance of light and shadow, the mystery of silence, and the magic of the sea shape this collection's material DNA, inspired by the volcanic island."
    },
    "Polignano": {
        "description": "波利尼亚诺系列灵感来自亚得里亚海海岸的波利尼亚诺小镇。沙的流动纹理与海浪永恒运动雕刻的自然印记，构成系列的核心视觉语言。Puntinato（点状）与 Arenaria（砂岩）两种表面效果，以手工瓷砖致敬这座以岩石景观和地中海风情闻名的海滨小镇。",
        "descriptionEn": "Polignano celebrates the natural beauty of Polignano a Mare. Shifting sand textures and natural imprints sculpted by the perpetual movement of the sea define the collection's visual language. Puntinato and Arenaria surfaces honor this coastal town renowned for its rocky landscapes."
    },
    "Repetit": {
        "description": "重复系列灵感来自纺织世界——名称 Repetit 源自拉丁语「repetita」（重复）与法语「petit」（小）的结合，强调以最小元素的重复构成风格的核心理念。Silver Grey（银灰）与 Brick（砖红）两种色调，将织物的编织韵律转化为瓷砖表面的节奏与色彩。",
        "descriptionEn": "Repetit draws from the textile world. The name unites Latin 'repetita' (repeat) and French 'petit' (small), emphasizing repetition of the minimal element as the collection's stylistic signature. Silver Grey and Brick tones translate woven rhythm into ceramic surfaces."
    },
    "Reverse": {
        "description": "反转系列以反向视角重新审视瓷砖设计——将通常次要的元素加以突出和强化。通过反转的视角，填缝与砖面的关系被重新定义，虚实之间形成新的视觉游戏。系列提供多种色调与图案组合，适合追求非常规设计表达的空间。",
        "descriptionEn": "Reverse pushes in unusual directions, accentuating what is normally secondary through an inverted perspective. The relationship between grout and tile surface is redefined, creating visual tension between solid and void. Multiple color and pattern combinations available."
    },
    "Rondo": {
        "description": "回旋系列如同一首视觉与音乐的协奏曲。优雅的停顿与均衡的节奏诠释出环绕般的舞蹈——活泼的美学韵律从细节中升起，如同没有终点的旋律。系列将不同图案如音乐主题般交织融合，创造出连续而和谐的空间乐章。",
        "descriptionEn": "Rondo is a musical and visual theme where elegant pauses and balance interpret a wrapping dance. A lively aesthetic rhythm emerges from details that unfold like an endless melody. The collection interweaves different patterns as musical motifs, creating continuous spatial harmony."
    },
    "Sanremo": {
        "description": "圣雷莫系列捕捉海、天空、沙滩与花朵的灵魂——如同在悬崖之巅度过的某个瞬间。Dalia（大丽花）与 Giglio（百合）等装饰花砖以花形和星形两种形态呈现，与基础砖面搭配，将利古里亚海岸的花香与海风凝固在手工陶瓷之中。",
        "descriptionEn": "Sanremo captures the souls of sea, sky, beaches, and flowers—a moment spent atop the cliffs. Dalia and Giglio decorative tiles in flower and star forms pair with base tiles, freezing the floral scent and sea breeze of the Ligurian coast into handcrafted ceramic."
    },
    "Stromboli": {
        "description": "斯特龙博利系列灵感来自同名火山岛——火与石从炽热深处诞生，塑造出永恒变化的景观。系列以黑色为底的耐火粘土手工制作，Petrolio（石油色）与 Grigio Artico（北极灰）等色调呈现火山岩的原始质感。每片瓷砖都是对这座岛屿独特之美的手工致敬。",
        "descriptionEn": "Stromboli is inspired by the volcanic island—fire and stone born from molten depths, shaping a landscape in perpetual transformation. Handcrafted with black-based refractory clay, tones like Petrolio and Grigio Artico convey the raw texture of volcanic rock."
    },
    "Torino": {
        "description": "都灵系列灵感来自著名的都灵夹心巧克力（Cremino）——层次的展开如同一口完美的品味体验。Noir（黑）、Nocciola（榛果）、Tè Verde（绿茶）等色调，将巧克力的优雅与精致重新诠释为兼具多功能性与当代感的设计。每片瓷砖以手工制作，呈现层叠的视觉质感。",
        "descriptionEn": "Torino is inspired by the celebrated cremino torinese—layers that unfold like a sublime tasting experience. Noir, Nocciola, and Tè Verde tones reinterpret the elegance and refinement of the chocolate into a versatile, contemporary design."
    },
    "Venezia": {
        "description": "威尼斯系列如同一幅悬于水天之间的画布，每条线条都消融在海洋马赛克的深处。系列捕捉威尼斯光的无限色调，将液态反射转化为手工陶瓷表面。水与光的交融、建筑倒影的摇曳，都被凝固在瓷砖的肌理之中。",
        "descriptionEn": "A canvas suspended between water and sky, where every line dissolves into the depth of a marine mosaic. The Venezia collection captures the infinite nuances of Venetian light, translating liquid reflections into handcrafted ceramic surfaces."
    },
    "Venezia Cromie": {
        "description": "威尼斯色彩系列重新诠释潟湖之城变幻莫测的色彩。水面的反射与灰泥立面的色调交融，构成充满活力的、永恒变化的调色板。系列将威尼斯这座城市自古以来的色彩灵感——艺术与设计的不竭源泉——转化为手工陶瓷的表面语言。",
        "descriptionEn": "Venezia Cromie reinterprets the variegated shades of the lagoon city, where water reflections and stucco facades merge into a palette of vibrant, ever-changing tones. Venice's colors—a perennial source of artistic inspiration—translated into handcrafted ceramic surfaces."
    },
}

# Also fix some existing Chinese descriptions that could be improved
REFINE_EXISTING = {
    "Milano70": {
        "description": "米兰70系列以70年代米兰风格为灵感，采用釉面瓷质砖工艺，呈现暖棕色调的复古质感。4×31cm细长条形搭配6.2×12.5cm方砖，光面釉面处理让空间流转着怀旧而精致的光影。适用于地面与客厅等现代风格空间。",
    },
    "Dandy": {
        "description": "丹迪系列灵感源自1762年伦敦 Almack's 俱乐部——那个只有贵族且有品味者方能进入的社交殿堂。经典几何图案、对比鲜明的色彩、看似随意却迷人的优雅——系列以非修边瓷质砖为载体，拒绝完美抛光大理石的千篇一律，以做旧效果呈现另类的精致。白、黑、绿三色，融合多种大理石纹理的同色调混搭，营造出动态、出人意料且百变的装饰效果。",
    },
    "Otto": {
        "description": "奥托系列诠释北欧湖泊石材的复杂简约之美。起点是对一种北欧湖石的重新演绎——这种石材以不同大小的颗粒混合为特征，随机变化的颗粒度和随开采点不同而变化的色调过渡是其根本特质。为凸显这些自然特征，系列开发了自然面、波纹面和划痕面三种表面处理，配合三种色调，服务于建筑设计的研究性探索。",
    },
}

count = 0
for item in data:
    col = item.get("collection", "")
    if col in FIXES:
        item["description"] = FIXES[col]["description"]
        item["descriptionEn"] = FIXES[col]["descriptionEn"]
        count += 1
    elif col in REFINE_EXISTING:
        item["description"] = REFINE_EXISTING[col]["description"]
        count += 1

with open(JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Updated {count} series descriptions")

# Verify
no_chinese = []
for item in data:
    desc = item.get("description", "")
    has_chinese = any("\u4e00" <= c <= "\u9fff" for c in desc)
    if not has_chinese:
        no_chinese.append(f"  {item['id']} {item['collection']}: {item['name']}")

if no_chinese:
    print("Still no Chinese in:")
    for line in no_chinese:
        print(line)
else:
    print("All descriptions now have Chinese text ✅")
