#set document(title: "Document-as-Code: PDF Design Proof", author: "Document-as-Code Lab")
#set text(font: "Libertinus Serif", size: 11pt, lang: "en")
#set page(paper: "a4", margin: (x: 22mm, top: 20mm, bottom: 22mm),
  footer: context [#text(size: 9pt, fill: rgb("53605a"))[DESIGN PROOF · NOT AN APPROVED EDITION #h(1fr) #counter(page).display()]] )
#set par(justify: false, leading: 0.65em)
#set heading(numbering: none)
#show heading: set text(font: "Libertinus Sans", fill: rgb("205e48"))
#show raw.where(block: true): it => block(width: 100%, inset: 10pt, fill: rgb("f1f4f3"), radius: 3pt)[#text(size: 9pt, it)]
#set table(stroke: (bottom: 0.5pt + rgb("cbd5ce")), inset: 8pt)
#let chapter-info(number, status, id, revision) = block(width: 100%, inset: 10pt, fill: rgb("edf3ef"), stroke: (left: 3pt + rgb("205e48")))[
  #text(font: "Libertinus Sans", size: 9pt)[*CHAPTER #number · #status* \ Source ID: #id \ Source revision: #revision]
]
#include "body.typ"
