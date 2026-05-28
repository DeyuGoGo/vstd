#!/bin/bash

# 用 CommitMessage.md 的內容 + 當前 branch 名稱組合成 commit message，自動 add+commit。
#
# 用法：
#   1. 編輯 CommitMessage.md 寫好訊息（一行或多行）
#   2. ./GitCommit.sh
#
# 結果：commit message 會變成 [<branch>]<CommitMessage.md 內容>
# CommitMessage.md 內容用完後可手動清空，下次再填。

# Step 1: Get the current branch name
branchName=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $branchName"

# Step 2: Read the commit message from the existing file (specify UTF-8 encoding)
commitMessage=$(cat CommitMessage.md)
echo "Commit message content: $commitMessage"

# Step 3: Create a new commit message with the branch name as the title
newCommitMessage="[${branchName}]${commitMessage}"
echo "New commit message: $newCommitMessage"

# Step 4: Write the new commit message to a new file (specify UTF-8 encoding)
echo -n "$newCommitMessage" > PushCommit.md
echo "New commit message written to PushCommit.md"

# Step 5: Add all changes to the git staging area
git add --all
echo "All changes added to staging area"

# Step 6: Commit the changes using the new commit message file
git commit -F PushCommit.md
echo "Changes committed"
