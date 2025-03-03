# 🚀 CI/CD Pipeline Setup for This Project

This project uses **GitHub Actions** to automate testing, building, and deployment. The CI/CD pipeline ensures that:

- ✅ Every push to `feat` or `staging` runs tests.
- ✅ `feat` automatically merges into `staging` but **not **``.
- ✅ **Deployments only happen when merging to **``.
- ✅ CI/CD runs **only when necessary** (avoiding unnecessary deployments).

---

## 📌 **Workflow Overview**

| Workflow Name     | Purpose                                                    |
| ----------------- | ---------------------------------------------------------- |
| `ci-tests.yml`    | Runs tests on every push to `feat`, `staging`, and `main`. |
| `deploy-main.yml` | Deploys the app when changes are merged into `main`.       |
| `auto-merge.yml`  | Auto-merges `feat` → `staging`, but NOT `main`.            |

---

## 🛠 **CI/CD Configuration**

### **📌 Triggers (When Does CI/CD Run?)**

This workflow runs:

```yaml
on:
  push:
    branches:
      - main
      - staging
      - feat
  pull_request:
    branches:
      - main
```

- **Push to **`**, **`**, or **``** → Runs tests** ✅
- **Pull request to **``** → Runs before merging** ✅

---

## 🔬 **CI: Running Tests on Every Commit**

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test
```

✔ **Tests run on every push to **`**, **`**, and **``\
✔ **If tests fail, deployment is blocked**

---

## 🚀 **CD: Deployment to Production (Only on **``**)**

```yaml
on:
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Deploy to Server
        run: |
          ssh user@your-server.com "cd /var/www/app && git pull && npm install && pm2 restart all"
```

✔ **Deployment only happens when code is pushed to **`\
✔ **This avoids unnecessary deployments from **`** or **``

---

## 🔄 **Auto Merge: **`** → **`

```yaml
on:
  push:
    branches:
      - feat
jobs:
  merge-to-staging:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Configure Git
        run: |
          git config --global user.name "GitHub Actions"
          git config --global user.email "actions@github.com"

      - name: Merge feat into staging
        run: |
          git checkout staging
          git merge origin/feat --no-edit
          git push origin staging
```

✔ **Every push to **`** auto-merges into **`\
✔ **Does NOT merge into **`` (to prevent accidental deployments)

---

## 🔥 **Optimizing CI/CD (When NOT to Run It)**

### **1️⃣ Skip CI/CD on Certain Commits**

If you **don’t want CI/CD to run**, use `[skip ci]` in the commit message:

```sh
git commit -m "Updated docs [skip ci]"
git push origin feat
```

Modify the workflow:

```yaml
if: "!contains(github.event.head_commit.message, '[skip ci]')"
```

### **2️⃣ Run CI/CD Only When Specific Files Change**

```yaml
on:
  push:
    branches:
      - main
      - staging
      - feat
    paths:
      - "src/**"
      - "package.json"
```

✔ **CI/CD runs only if** `src/` files or `package.json` change.\
✔ **Does NOT trigger for** README updates or documentation changes.

### **3️⃣ Run CI/CD Only on Merges (Not Every Commit)**

```yaml
on:
  pull_request:
    branches:
      - main
```

✔ **CI/CD only runs when a PR is merged into **``\
✔ **This prevents unnecessary runs on every small commit**

---

## 🚀 **How to Use This CI/CD Pipeline**

1️⃣ **Create feature branches:**

```sh
git checkout -b feat-new-feature
```

2️⃣ **Push changes to **`** (triggers tests, auto-merges to **`**)**

```sh
git push origin feat-new-feature
```

3️⃣ **Merge **`** into **`** (triggers deployment)**

```sh
git checkout main
git merge staging
git push origin main
```

---

## 🔍 **Troubleshooting**

### ❌ **CI/CD Fails on **`** but Deploys to **`** Anyway**

- Check GitHub Actions logs for test failures.
- Ensure that `main` only merges code that **passed tests**.

### ❌ **Deployment Didn’t Run?**

- Confirm that the **workflow trigger includes **``.
- Check if the **SSH connection is working**.
- Ensure that **the server has the latest code**.

---

## 🎯 **Summary**

| CI/CD Feature        | Branch                                     | Action                               |
| -------------------- | ------------------------------------------ | ------------------------------------ |
| ✅ Run Tests         | feat, staging, main                        | Runs on every commit                 |
| 🔄 Auto Merge        | feat → staging                             | Merges automatically                 |
| 🚀 Deploy to Prod    | main                                       | Only when code is merged into `main` |
| ⏳ Skip CI/CD        | Any branch                                 | Use `[skip ci]` in commit message    |
| 🛠 Run on File Change | Only when `src/` or `package.json` updates | Prevents unnecessary runs            |

---

## 📢 **Need More Customization?**

Do you need:

- **Docker-based deployment?**
- **Auto-merge between more branches?**
- **Deployment to AWS, Firebase, or DigitalOcean?**

Let me know, and I’ll update the workflow! 🚀🔥
