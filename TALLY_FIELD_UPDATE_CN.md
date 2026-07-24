# Auralis Custom Order｜Tally 字段修改说明

保留现有 Tally 表单时，建议把表单顺序调整为：

## 第一屏：5 个核心必填
1. Preferred Budget（必填）
   - Under US$60
   - US$60–100
   - US$100–200
   - US$200–300
   - US$300+
   - Not sure yet

2. Preferred Colors or Style（必填）
   - 短文本

3. Wrist Size（必填）
   - 短文本
   - 提示：Enter your wrist size, or write “Not sure yet.”

4. For Yourself or as a Gift?（必填）
   - For myself
   - Birthday gift
   - Friendship gift
   - Anniversary gift
   - Family gift
   - Other

5. Delivery Country（必填）
   - 短文本或国家选择

## 第二屏：推荐方向
6. Which Option Are You Open To?（选填）
   - Let Auralis recommend（放第一项并默认）
   - Ready-to-ship bracelet
   - Simple personalization
   - Fully custom-made bracelet

## 第三屏：补充信息
7. Reference Photo / Screenshot（选填，支持上传）
8. Birth Date or Chinese Five Elements Request（选填）
9. Quantity（选填）
10. Needed-by Date（选填）
11. Name（建议必填）
12. Email or WhatsApp（建议至少一个必填）
13. Other Notes（选填）

## 表单顶部说明
You do not need to choose between ready-to-ship and custom first. Tell Auralis your budget and preferences, and we will recommend a suitable direction before quote and payment.

## 价格提示
Fully custom-made bracelet requests generally start around US$60. Ready-to-ship and existing designs are priced individually and may be lower or higher depending on materials and craftsmanship.

## 提交成功提示
Thank you. Auralis has received your request.

We will review your budget, style direction, wrist size, purpose and delivery country, then recommend a suitable ready-to-ship, simply personalized or fully custom direction.

No payment is needed before the recommendation and quote are confirmed.

For faster help, message us on WhatsApp: +86 183 5759 0167

## 隐藏字段建议
- source_page
- utm_source
- utm_medium
- utm_campaign
- utm_content
- request_type

## Tally 分支逻辑
- Under US$60：提示“Ready-to-ship or selected existing designs may be recommended first.”
- US$60+：显示完整定制相关选项
- Five Elements Reading：显示出生日期、出生时间、出生地、1–2 个问题
- Gift：显示礼物对象、场景、包装和留言卡
