#!/usr/bin/env python3
import os
import glob
import re

def fix_script_tags():
    print("Fixing <script> tags for Vite bundling...")
    html_files = glob.glob("*.html")
    fixed_count = 0

    for file_path in html_files:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Replace <script src="..." (without type="module") with <script type="module" src="..."
        # Pattern matches <script src="..." where type="module" is missing
        new_content = re.sub(
            r'<script\s+(?!type=["\']module["\'])(src=["\'][^"\']+\.js["\'])',
            r'<script type="module" \1',
            content
        )

        if new_content != content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"  Fixed: {file_path}")
            fixed_count += 1

    print(f"Updated {fixed_count} HTML files with type='module' attributes.")

if __name__ == "__main__":
    fix_script_tags()
