#!/usr/bin/env bash
set -euo pipefail

check_file() { [[ -f "$1" ]] || { echo "Missing file: $1"; exit 1; }; }
check_dir() { [[ -d "$1" ]] || { echo "Missing dir: $1"; exit 1; }; }

# Tickets and prompts
check_file "Tickets/Sprint 2/TICKET-201.md"
check_file "Tickets/Sprint 2/TICKET-202.md"
check_file "Tickets/Sprint 2/TICKET-203.md"
check_file "Tickets/Sprint 2/TICKET-204.md"
check_file "Tickets/Sprint 2/TICKET-205.md"
check_file "Tickets/Sprint 2/TICKET-206.md"
check_file "Tickets/Sprint 2/TICKET-207.md"
check_file "Tickets/Sprint 2/TICKET-208.md"
check_file "Build_documentation/Cursor Ticket Prompts/Sprint 2/TICKET-201 Prompt.md"
check_file "Build_documentation/Cursor Ticket Prompts/Sprint 2/TICKET-202 Prompt.md"
check_file "Build_documentation/Cursor Ticket Prompts/Sprint 2/TICKET-203 Prompt.md"
check_file "Build_documentation/Cursor Ticket Prompts/Sprint 2/TICKET-204 Prompt.md"
check_file "Build_documentation/Cursor Ticket Prompts/Sprint 2/TICKET-205 Prompt.md"
check_file "Build_documentation/Cursor Ticket Prompts/Sprint 2/TICKET-206 Prompt.md"
check_file "Build_documentation/Cursor Ticket Prompts/Sprint 2/TICKET-207 Prompt.md"
check_file "Build_documentation/Cursor Ticket Prompts/Sprint 2/TICKET-208 Prompt.md"

# Packages
check_dir "packages/writing-style-analyzer"
check_file "packages/writing-style-analyzer/src/analyzeWritingStyle.js"
check_dir "packages/web-scraping-module"
check_file "packages/web-scraping-module/src/WebScrapingModule.js"
check_dir "packages/ai-humanization-module"
check_file "packages/ai-humanization-module/src/AIHumanizationModule.js"
check_dir "packages/embedding-generator"
check_file "packages/embedding-generator/src/generateEmbedding.js"
check_dir "packages/vector-search"
check_file "packages/vector-search/src/findSimilarLines.js"
check_dir "packages/ai-line-generator"
check_file "packages/ai-line-generator/src/generateLines.js"
check_dir "packages/source-attribution"
check_file "packages/source-attribution/src/SourceAttributionModule.js"
check_dir "packages/watermark-removal"
check_file "packages/watermark-removal/src/WatermarkRemovalModule.js"

# Migrations
check_file "database/migrations/011_vector_search_fn.sql"
check_file "database/migrations/012_source_attributions.sql"

echo "Cross checks passed." 