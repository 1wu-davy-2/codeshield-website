# CodeShield 官网：产品操作界面截图资产说明（已完成）

深色 / 浅色两套截图均已放入官网目录并接入。切换站点主题时，操作界面截图会自动轮动。

## 已交付并已接入

| 产品 | 文件 | 尺寸 | 状态 |
| --- | --- | --- | --- |
| Python 深色工作台 | `public/assets/img/product/python-workbench-dark.png` | 1600 × 1000 | 已接入 |
| Python 浅色工作台 | `public/assets/img/product/python-workbench-light.png` | 1600 × 1000 | 已接入 |
| Java 深色工作台 | `public/assets/img/product/java-workbench-dark.png` | 1600 × 1000 | 已接入 |
| Java 浅色工作台 | `public/assets/img/product/java-workbench-light.png` | 1600 × 1000 | 已接入 |

基础文件 `python-workbench.png` / `java-workbench.png` 保留作为回退。

- 宽高比固定 **16:10**。
- 浅色版请保持与深色版**完全相同的布局、项目名、构建数据、许可证状态和日志内容**，只切换浅色主题；这样用户切换站点主题时，界面内容不会跳动。
- 使用演示数据，不出现真实客户名、许可证、机器码、邮箱、密钥或调试密码。
- 不需要额外加圆角、阴影或浏览器外框，官网会统一处理。
- 命名必须准确：`python-workbench-light.png`、`java-workbench-light.png`。

## 官网加载顺序

- 深色主题：`{product}-workbench-dark.png` → `{product}-workbench.png` → 内置示意图
- 浅色主题：`{product}-workbench-light.png` → `{product}-workbench.png` → 内置示意图

浅色图片放入后，重新执行 `npm run build` 或让开发服务器热更新，无需修改 React 代码。

## 若后续需要重拍，可直接发给设计/产品同事的话术

> 请再补两张 CodeShield 官网用的**浅色主题**产品工作台截图，要求与现有深色版完全同布局、同数据、同状态，只切换浅色 UI，方便官网跟随主题自动切换：
>
> 1）Python：项目 erp-portal，CPython 3.12 / Django 5.2，48 modules sealed、AES-256-GCM，pyshield.lic VALID、2027-12-31 到期、machine · first run，日志包含 Scan → Encrypt → Sign → Ready 以及 disk ciphertext / plaintext only in memory。
> 2）Java：项目 order-service，JDK 17 / Spring Boot 3.2，1,284 classes、stub + sidecar、Launcher-Agent-Class，jshield.lic VALID、2027-12-31 到期、machine · first run，日志包含启动、Actuator healthy 和内存解密。
>
> 尺寸 1600×1000 或 3200×2000，16:10，PNG，单张小于 800 KB。使用演示数据，不要真实客户、许可证、机器码或密钥。文件名严格按照：
> `python-workbench-light.png`
> `java-workbench-light.png`
> 放入 `website/public/assets/img/product/` 即可。
>
> 现有深色版不需要重做，官网已经按深色主题接入。

## 如果希望重新统一深色版

也可以同时提供：
- `python-workbench-dark.png`
- `java-workbench-dark.png`

官网会优先使用带 `-dark` 的文件；基础文件 `python-workbench.png` / `java-workbench.png` 会作为回退。
