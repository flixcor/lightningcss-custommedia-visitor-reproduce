import { transform, browserslistToTargets } from "lightningcss"
import { Buffer } from "node:buffer"

const targets = browserslistToTargets([">= 0.25%"])
const drafts = { customMedia: true }

const code = Buffer.from(`
@custom-media --motionOK (prefers-reduced-motion: no-preference);
@media (--motionOK) {
  .animation {
    animation: dissolve 4s linear infinite both;
  }
}
`)

const { code: dontReturnStylesheet } = transform({
  targets,
  drafts,
  code,
  visitor: {
    StyleSheetExit: () => { }
  },
})

const { code: returnStylesheet } = transform({
  targets,
  drafts,
  code,
  visitor: {
    StyleSheetExit: s => s
  },
})

console.log(dontReturnStylesheet.toString())
/*
@media (prefers-reduced-motion: no-preference) {
  .animation {
    animation: 4s linear infinite both dissolve;
  }
}

*/

console.log(returnStylesheet.toString())
/*
@custom-media --motionOK (prefers-reduced-motion: no-preference);

@media (--motionOK) {
  .animation {
    animation: 4s linear infinite both dissolve;
  }
}

*/