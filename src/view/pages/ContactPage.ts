import { BREADCRUMBS, BUTTON_GROUPS } from "~/constant";
import { breadCrumbs } from "../components/breadCrumb";
import { groupButton } from "../components/groupButton";

export const ContactPage = (): HTMLElement => {
  const container = document.createElement("div");
  container.className = "page-container";

  container.innerHTML = `
    <div class="product-list">
                <div class="product-title">
                    <div class="product-title-left">
    ${breadCrumbs(
      BREADCRUMBS.ADD_CATEGORY.items,
      BREADCRUMBS.PRODUCT_LIST.icon
    )}
                    </div>
                    <div class="product-title-right">
                        ${groupButton(BUTTON_GROUPS.LIST.CATEGORY)}
                    </div>
                </div>
            </div>

    
    <div class="content-section">
      <div class="contact-container">
        <div class="contact-info">
          <h2>Thông tin liên hệ</h2>
          <div class="contact-item">
            <div class="contact-icon">📧</div>
            <div class="contact-details">
              <h3>Email</h3>
              <p>contact@typescript-app.com</p>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon">📱</div>
            <div class="contact-details">
              <h3>Điện thoại</h3>
              <p>+84 123 456 789</p>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon">📍</div>
            <div class="contact-details">
              <h3>Địa chỉ</h3>
              <p>123 TypeScript Street, Code City</p>
            </div>
          </div>
        </div>
        
        <div class="contact-form-container">
          <h2>Gửi tin nhắn</h2>
          <form class="contact-form" id="contactForm">
            <div class="form-group">
              <label for="name">Họ tên</label>
              <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="subject">Chủ đề</label>
              <input type="text" id="subject" name="subject" required>
            </div>
            <div class="form-group">
              <label for="message">Tin nhắn</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Gửi tin nhắn</button>
          </form>
        </div>
      </div>
    </div>
  `;

  // Handle form submission
  const handleSubmit = (e: Event): void => {
    e.preventDefault();

    // Show success message
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    alert(
      `Cảm ơn ${formData.get("name")}! Tin nhắn của bạn đã được gửi thành công.`
    );
    form.reset();
  };

  // Add form event listener after the element is in the DOM
  setTimeout(() => {
    const form = document.getElementById("contactForm") as HTMLFormElement;
    if (form) {
      form.addEventListener("submit", handleSubmit);
    }
  }, 0);

  return container;
};
