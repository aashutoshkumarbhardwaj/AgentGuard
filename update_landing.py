import re

filepath = 'frontend/components/landing/landing-page.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Replace the imports
content = re.sub(
    r'import \{[\s\S]*?from \'./sections\';',
    """import {
  Header,
  CinematicIntro,
  MemoryUseCases,
  LayerSequence,
  BrandMarkFrame,
  WorkflowSection,
  CaseStudiesSection,
  TestimonialsSection,
  BenchmarksSection,
  PreFooterTalk,
  FooterCta
} from './sections';""",
    content
)

# Remove MainScrollSequence definition
content = re.sub(
    r'function MainScrollSequence\(\) \{[\s\S]*?return \([\s\S]*?section>\s*\);\s*\}',
    '',
    content
)

# Replace MainScrollSequence in the LandingPage return block
content = re.sub(
    r'<MainScrollSequence />',
    '<CinematicIntro />',
    content
)

with open(filepath, 'w') as f:
    f.write(content)

print("Updated landing-page.tsx")
