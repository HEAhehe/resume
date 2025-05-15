// Interactive features for resume
document.addEventListener('DOMContentLoaded', () => {
  // Variables
  const modal = document.getElementById('modal');
  const closeBtn = document.querySelector('.close');
  const addExpBtn = document.getElementById('add-experience');
  const addEduBtn = document.getElementById('add-education');
  const modalForm = document.getElementById('modal-form');
  const modalTitle = document.getElementById('modal-title');
  const modalFields = document.getElementById('modal-fields');
  const expList = document.getElementById('experience-list');
  const eduList = document.getElementById('education-list');
  let currentMode = '';

  // ข้อมูลเริ่มต้น
  let experienceData = [];
  let educationData = [];

  // โหลดข้อมูลจาก LocalStorage
  function loadDataFromLocalStorage() {
    const storedExperience = localStorage.getItem('resumeExperience');
    const storedEducation = localStorage.getItem('resumeEducation');

    if (storedExperience) {
      experienceData = JSON.parse(storedExperience);
      renderExperienceItems();
    }

    if (storedEducation) {
      educationData = JSON.parse(storedEducation);
      renderEducationItems();
    }
  }

  // บันทึกข้อมูลไปยัง LocalStorage
  function saveToLocalStorage() {
    localStorage.setItem('resumeExperience', JSON.stringify(experienceData));
    localStorage.setItem('resumeEducation', JSON.stringify(educationData));
  }

  // แสดงข้อมูลประสบการณ์ทำงาน
  function renderExperienceItems() {
    expList.innerHTML = ''; // เคลียร์รายการเดิมก่อน
    
    experienceData.forEach((exp, index) => {
      const expItem = document.createElement('div');
      expItem.className = 'experience-item';
      expItem.innerHTML = `
        <div class="experience-header">
          <h3>${exp.company}</h3>
          <span class="date">${exp.period}</span>
        </div>
        <p class="job-title">ตำแหน่ง: ${exp.position}</p>
        <p class="job-description">${exp.description}</p>
        <div class="item-actions">
          <button class="edit-btn" data-type="experience" data-index="${index}">แก้ไข</button>
          <button class="delete-btn" data-type="experience" data-index="${index}">ลบ</button>
        </div>
      `;
      
      expList.appendChild(expItem);
    });

    // เพิ่ม event listeners สำหรับปุ่มแก้ไขและลบ
    addItemActionListeners();
  }

  // แสดงข้อมูลการศึกษา
  function renderEducationItems() {
    eduList.innerHTML = ''; // เคลียร์รายการเดิมก่อน
    
    educationData.forEach((edu, index) => {
      const eduItem = document.createElement('div');
      eduItem.className = 'education-item';
      eduItem.innerHTML = `
        <div class="education-header">
          <h3>${edu.school}</h3>
          <span class="date">${edu.period}</span>
        </div>
        <p class="degree">${edu.degree}</p>
        <p class="education-description">${edu.description}</p>
        <div class="item-actions">
          <button class="edit-btn" data-type="education" data-index="${index}">แก้ไข</button>
          <button class="delete-btn" data-type="education" data-index="${index}">ลบ</button>
        </div>
      `;
      
      eduList.appendChild(eduItem);
    });

    // เพิ่ม event listeners สำหรับปุ่มแก้ไขและลบ
    addItemActionListeners();
  }

  // เพิ่ม event listeners สำหรับปุ่มแก้ไขและลบ
  function addItemActionListeners() {
    // ปุ่มแก้ไข
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.target.dataset.type;
        const index = parseInt(e.target.dataset.index);
        editItem(type, index);
      });
    });

    // ปุ่มลบ
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.target.dataset.type;
        const index = parseInt(e.target.dataset.index);
        deleteItem(type, index);
      });
    });
  }

  // แก้ไขรายการ
  function editItem(type, index) {
    if (type === 'experience') {
      const exp = experienceData[index];
      openModal('experience-edit');
      
      // ตั้งค่าฟอร์มด้วยข้อมูลที่มีอยู่
      document.getElementById('company').value = exp.company;
      document.getElementById('period').value = exp.period;
      document.getElementById('position').value = exp.position;
      document.getElementById('exp-description').value = exp.description;
      
      // เก็บข้อมูล index ที่กำลังแก้ไข
      modalForm.dataset.editIndex = index;
    } else if (type === 'education') {
      const edu = educationData[index];
      openModal('education-edit');
      
      // ตั้งค่าฟอร์มด้วยข้อมูลที่มีอยู่
      document.getElementById('school').value = edu.school;
      document.getElementById('edu-period').value = edu.period;
      document.getElementById('degree').value = edu.degree;
      document.getElementById('edu-description').value = edu.description;
      
      // เก็บข้อมูล index ที่กำลังแก้ไข
      modalForm.dataset.editIndex = index;
    }
  }

  // ลบรายการ
  function deleteItem(type, index) {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบรายการนี้?')) {
      if (type === 'experience') {
        experienceData.splice(index, 1);
        renderExperienceItems();
      } else if (type === 'education') {
        educationData.splice(index, 1);
        renderEducationItems();
      }
      
      // บันทึกข้อมูลหลังลบ
      saveToLocalStorage();
    }
  }

  // Animate skill bars on scroll
  const skillLevels = document.querySelectorAll('.skill-level');
  
  // Store original widths and set to 0
  skillLevels.forEach(skill => {
    skill.dataset.width = skill.style.width;
    skill.style.width = '0';
  });
  
  // Function to animate skills when they come into view
  const animateSkills = () => {
    skillLevels.forEach(skill => {
      const rect = skill.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        skill.style.width = skill.dataset.width;
      }
    });
  };
  
  // Initial check and add scroll listener
  animateSkills();
  window.addEventListener('scroll', animateSkills);

  // Modal functions
  const openModal = (mode) => {
    modal.style.display = 'block';
    currentMode = mode;
    
    if (mode === 'experience' || mode === 'experience-edit') {
      modalTitle.textContent = mode === 'experience' ? 'เพิ่มประสบการณ์ทำงาน' : 'แก้ไขประสบการณ์ทำงาน';
      modalFields.innerHTML = `
        <div class="form-group">
          <label for="company">บริษัท/องค์กร</label>
          <input type="text" id="company" required>
        </div>
        <div class="form-group">
          <label for="period">ช่วงเวลา</label>
          <input type="text" id="period" placeholder="เช่น 2021 - 2023" required>
        </div>
        <div class="form-group">
          <label for="position">ตำแหน่ง</label>
          <input type="text" id="position" required>
        </div>
        <div class="form-group">
          <label for="exp-description">รายละเอียดงาน</label>
          <textarea id="exp-description" required></textarea>
        </div>
      `;
    } else if (mode === 'education' || mode === 'education-edit') {
      modalTitle.textContent = mode === 'education' ? 'เพิ่มข้อมูลการศึกษา' : 'แก้ไขข้อมูลการศึกษา';
      modalFields.innerHTML = `
        <div class="form-group">
          <label for="school">สถาบันการศึกษา</label>
          <input type="text" id="school" required>
        </div>
        <div class="form-group">
          <label for="edu-period">ช่วงเวลา</label>
          <input type="text" id="edu-period" placeholder="เช่น 2019 - 2023" required>
        </div>
        <div class="form-group">
          <label for="degree">วุฒิการศึกษา/สาขาวิชา</label>
          <input type="text" id="degree" required>
        </div>
        <div class="form-group">
          <label for="edu-description">รายละเอียดเพิ่มเติม</label>
          <textarea id="edu-description" placeholder="เช่น เกรดเฉลี่ย, กิจกรรมที่ทำ"></textarea>
        </div>
      `;
    }
  };

  const closeModal = () => {
    modal.style.display = 'none';
    modalForm.reset();
    delete modalForm.dataset.editIndex; // ลบข้อมูล index ที่กำลังแก้ไข
  };

  // Event listeners
  addExpBtn.addEventListener('click', () => openModal('experience'));
  addEduBtn.addEventListener('click', () => openModal('education'));
  closeBtn.addEventListener('click', closeModal);
  
  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Form submission
  modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (currentMode === 'experience' || currentMode === 'experience-edit') {
      const company = document.getElementById('company').value;
      const period = document.getElementById('period').value;
      const position = document.getElementById('position').value;
      const description = document.getElementById('exp-description').value;
      
      const expData = {
        company,
        period,
        position,
        description
      };
      
      if (currentMode === 'experience-edit' && modalForm.dataset.editIndex) {
        // แก้ไขข้อมูลเดิม
        const index = parseInt(modalForm.dataset.editIndex);
        experienceData[index] = expData;
      } else {
        // เพิ่มข้อมูลใหม่
        experienceData.push(expData);
      }
      
      renderExperienceItems();
      saveToLocalStorage();
      
    } else if (currentMode === 'education' || currentMode === 'education-edit') {
      const school = document.getElementById('school').value;
      const period = document.getElementById('edu-period').value;
      const degree = document.getElementById('degree').value;
      const description = document.getElementById('edu-description').value;
      
      const eduData = {
        school,
        period,
        degree,
        description
      };
      
      if (currentMode === 'education-edit' && modalForm.dataset.editIndex) {
        // แก้ไขข้อมูลเดิม
        const index = parseInt(modalForm.dataset.editIndex);
        educationData[index] = eduData;
      } else {
        // เพิ่มข้อมูลใหม่
        educationData.push(eduData);
      }
      
      renderEducationItems();
      saveToLocalStorage();
    }
    
    closeModal();
  });

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Add active class to nav links on scroll
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
  
  // Contact form handling
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      
      // Normally you would send this data to a server
      // For demo, we'll show a success message
      alert(`Thanks ${name}! Your message has been received. I'll get back to you soon.`);
      contactForm.reset();
      
      // Email simulation log
      console.log('Message Details:');
      console.log(`From: ${name} <${email}>`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
    });
  }

  // เพิ่มคุณสมบัติสำหรับบันทึกข้อมูล About me
  const aboutSection = document.querySelector('#about .section-content p');
  if (aboutSection) {
    // โหลดข้อมูล About me จาก LocalStorage
    const savedAbout = localStorage.getItem('resumeAbout');
    if (savedAbout) {
      aboutSection.textContent = savedAbout;
    }

    // เพิ่มปุ่มแก้ไข About me
    const aboutSectionContainer = document.querySelector('#about .section-content');
    const editAboutBtn = document.createElement('button');
    editAboutBtn.textContent = 'แก้ไขข้อมูลส่วนตัว';
    editAboutBtn.className = 'edit-about-btn add-button';
    aboutSectionContainer.appendChild(editAboutBtn);

    // Event listener สำหรับปุ่มแก้ไข About me
    editAboutBtn.addEventListener('click', () => {
      modal.style.display = 'block';
      modalTitle.textContent = 'แก้ไขข้อมูลส่วนตัว';
      modalFields.innerHTML = `
        <div class="form-group">
          <label for="about-text">ข้อมูลส่วนตัว</label>
          <textarea id="about-text" required>${aboutSection.textContent}</textarea>
        </div>
      `;
      currentMode = 'about';
    });
  }

  // แก้ไขการ submit เพื่อรองรับการแก้ไขข้อมูล About me
  const originalSubmitHandler = modalForm.onsubmit;
  modalForm.addEventListener('submit', (e) => {
    if (currentMode === 'about') {
      e.preventDefault();
      const aboutText = document.getElementById('about-text').value;
      aboutSection.textContent = aboutText;
      localStorage.setItem('resumeAbout', aboutText);
      closeModal();
    }
  });

  // โหลดข้อมูลเมื่อโหลดหน้าเว็บ
  loadDataFromLocalStorage();
});