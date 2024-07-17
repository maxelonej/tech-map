const currentPage = document.body.getAttribute("data-page");
console.log(currentPage);
let url = "";
const params = new URLSearchParams(document.location.search);
const domain = window.location.hostname;
const task_id = params.get("ids[]");
const product_code = encodeURIComponent(params.get("product_code"));
const user_token = params.get("token");
const user_id = params.get("user_id");
const urlParams = `token=${user_token}&user_id=${user_id}&ids[]=${task_id}&product_code=${product_code}`;
if (currentPage === "LTK") {
  url = `https://${domain}/9x/app/php/ltm-tech-map.php?${urlParams}`;
} else if (currentPage === "PTK") {
  url = `https://${domain}/9x/app/php/tech-map.php?${urlParams}`;
}
const openNewTab = () => window.open(window.location.href, "_blank");

// if (currentPage === 'LTK') {
//     // Здесь код, специфичный для страницы ЛТК
// } else if (currentPage === 'PTK') {
//     // Здесь код, специфичный для страницы ПТК
// }

function ShowModal() {
  const tbody = document.getElementById("tableBody");
  const recipeButton = document.getElementById("recipeButton");
  const sumValue = document.querySelector('.form-container input[type="text"]'); // Находим поле ввода общего процента

  // recipeButton.classList.add('recipeButton-style');

  recipeButton.addEventListener("click", () => {
    tbody.innerHTML = "";
    const keys = ["inci", "chemicalName", "provider", "name", "percent"];
    const selectedVersion = document.querySelector(".versiontk").value;

    let header = data.data["tech-map"][selectedVersion].header;
    console.log(selectedVersion);
    console.log(header);

    let totalPercent = 0;

    header.forEach((component, index) => {
      console.log(`Обрабатываем компонент ${index + 1}:`, component); // Логируем информацию о текущем компоненте

      const row = document.createElement("tr");

      keys.forEach((key) => {
        const cell = document.createElement("td");

        if (key === "percent") {
          // Умножаем значение на 100 сразу при обработке, чтобы избежать последующего умножения итога
          component.totalPercent = parseFloat(component[key]) * 100;
          console.log(
            `Компонент ${index + 1}, Ключ '${key}':`,
            component[key],
            "=>",
            component.totalPercent
          ); // Логируем исходное и преобразованное значение

          cell.textContent = component.totalPercent;
          totalPercent += component.totalPercent;
          console.log(
            `Общий процент после добавления компонента ${index + 1}:`,
            totalPercent
          ); // Логируем общий процент после добавления
        } else {
          cell.textContent = component[key];
          console.log(`Компонент ${index + 1}, Ключ '${key}':`, component[key]); // Логируем значение для других ключей
        }

        row.appendChild(cell);
      });

      tbody.appendChild(row);
    });

    // Теперь totalPercent уже содержит итоговую сумму, умноженную на 100, поэтому дальнейшее умножение на 100 не требуется
    console.log("Итоговая сумма после умножения на 100:", totalPercent);

    // Сокращаем итоговое число до 4 символов после запятой
    totalPercent = totalPercent.toFixed(4);
    console.log(
      "Итоговая сумма после сокращения до 4 символов после запятой:",
      totalPercent
    );

    // Находим кнопку закрытия модального окна
    const closeButton = document.getElementById("closerecipe");

    // Добавляем обработчик событий click
    if (closeButton) {
      closeButton.addEventListener("click", function () {
        // Скрываем модальное окно
        $("#dataModal").modal("hide");
      });
    }

    sumValue.value = totalPercent;

    let modal = $("#dataModal");
    modal.modal("show");
    modal.find(".modal-dialog").addClass("modal-dialog-centered");
    modal.find(".modal-content").addClass("modal-content-full-height");
  });
}

const getData = async (url) => {
  const uniqueUrl = `${url}&timestamp=${new Date().getTime()}`;
  return await sendData(uniqueUrl, "GET");
};

const sendData = async (url, method, data = null) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
    comsole.log(data);
  }

  const res = await fetch(url, options);
  if (!res.ok) {
    alert("Ошибка при загрузке данных");
    return false;
  }
  try {
    return await res.json();
  } catch (error) {
    return false;
  }
};

const filterEmptyValues = (obj) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value && typeof value === "object") {
      value = filterEmptyValues(value); // Recursively filter nested objects
    }
    if (value !== null && value !== "") {
      acc[key] = value; // Keep only non-empty values
    }
    return acc;
  }, {});
};

function collectComponentsData(table) {
  const componentsData = {};
  const rows = table.querySelectorAll("tr.component");
  let newComponentCounter = 1; // Счетчик для компонентов без идентификатора

  rows.forEach((row) => {
    let componentID = row.getAttribute("db");
    if (!componentID) {
      componentID = `new ${newComponentCounter}`; // Присваиваем уникальный ID компоненту без идентификатора
      newComponentCounter++; // Увеличиваем счетчик для следующего компонента
    }

    const componentData = { number: newComponentCounter }; // Начальное значение для 'number'

    const cells = row.querySelectorAll("td");
    cells.forEach((cell, index) => {
      // Пропускаем первую и последнюю ячейку (№ и кнопка Удалить)
      if (index === 0 || index === cells.length - 1) return;

      let value;
      const input = cell.querySelector("input");
      const select = cell.querySelector("select");

      if (input) {
        value = input.value;
      } else if (select) {
        value = select.value;
      } else {
        value = cell.textContent;
      }

      if (value !== "" && value !== undefined && currentPage === "LTK") {
        switch (index) {
          case 2:
            componentData["component_id"] = value;
            break;
          case 3:
            if (["AAA-Test#1"].includes(dataversion.product_code)) {
              componentData["percent"] = value;
            } else {
              componentData["percent"] = value / 100; // Этот код будет выполнен, если условие if не выполняется
            }
            break;
          case 6:
            componentData["function_component_id"] = value;
            break;
          case 7:
            componentData["temp_mode"] = value;
            break;
          case 8:
            componentData["phNorma"] = value;
            break;
          case 9:
            componentData["delivery_method_id"] = value;
            break;
          case 10:
            componentData["visual_control_id"] = value;
            break;
          case 11:
            componentData["final_state_id"] = value;
            break;
        }
      } else if (value !== "" && value !== undefined && currentPage === "PTK") {
        switch (index) {
          case 2:
            componentData["component_id"] = value;
            break;
          case 3:
            if (["AAA-Test#1"].includes(dataversion.product_code)) {
              componentData["percent"] = value;
            } else {
              componentData["percent"] = value / 100; // Этот код будет выполнен, если условие if не выполняется
            }
            break;
          case 6:
            componentData["function_component_id"] = value;
            break;
          case 7:
            componentData["time_prepare"] = value;
            break;
          case 8:
            componentData["time_load"] = value;
            break;
          case 9:
            componentData["time_processing"] = value;
            break;
          case 10:
            componentData["temp_mode"] = value;
            break;
          case 11:
            componentData["phNorma"] = value;
            break;
          case 12:
            componentData["delivery_method_id"] = value;
            break;
          case 13:
            componentData["visual_control_id"] = value;
            break;
          case 14:
            componentData["final_state_id"] = value;
            break;
        }
      }
    });

    if (Object.keys(componentData).length > 1) {
      componentsData[componentID] = componentData;
      newComponentCounter++; // Прибавляем 1 к 'number' для следующего компонента
    }
  });

  return componentsData;
}

let newComponentCounter = 1;

const collectData = () => {
  const dataTech = {}; // Объявляем переменную для хранения всех данных
  let newComponentCounter = 1; // Убедитесь, что счетчик объявлен в области видимости функции

  const phases = document.querySelectorAll(".phase");

  phases.forEach((phase) => {
    let ID = phase.id; // Получаем ID контейнера фазы
    if (!ID) {
      ID = `new ${newComponentCounter}`; // Присваиваем уникальный ID компоненту без идентификатора
      newComponentCounter++; // Увеличиваем счетчик для следующего компонента
    }
    const select = document.getElementById("versionSelect");
    const dataversionID = select.getAttribute("data-dataversion-id"); // Получаем значение dataversion.ID
    console.log(dataversionID);
    const phaseDataEntries = [
      [
        "adress_phase_id",
        phase.querySelector(".adress_phase_id")?.value.trim(),
      ],
      [
        "equipment_id",
        Array.from(
          document.querySelectorAll(".equipment_id option:checked")
        ).map((option) => option.value),
      ],
      [
        "delivery_method_id",
        phase.querySelector(".delivery_method_id")?.value.trim(),
      ],
      ["feed_type_id", phase.querySelector(".feed_type_id")?.value.trim()],
      ["mixer_type_id", phase.querySelector(".mixer_type_id")?.value.trim()],
      ["airing_id", phase.querySelector(".airing_id")?.value.trim()],
      [
        "mixing_intensity_id",
        phase.querySelector(".mixing_intensity_id")?.value.trim(),
      ],
      [
        "type_of_equipment_id",
        phase.querySelector(".type_of_equipment_id")?.value.trim(),
      ],
      ["appearance_id", phase.querySelector(".appearance_id")?.value.trim()],
      ["name", phase.querySelector(".name-select")?.value.trim()],
      ["num_phase", phase.querySelector(".num_phase")?.value.trim()],
      [
        "rotation_mixing",
        phase.querySelector(".rotation_mixing")?.value.trim(),
      ],
      ["ph", phase.querySelector(".ph")?.value.trim()],
      ["rotation_speed", phase.querySelector(".rotation_speed")?.value.trim()],
      ["time_general", phase.querySelector(".time_general")?.value.trim()],
      ["time_to_mix", phase.querySelector(".time_to_mix")?.value.trim()],
      ["time_work", phase.querySelector(".time_work")?.value.trim()],
      ["time_load", phase.querySelector(".time_load")?.value.trim()],
      ["time_supply", phase.querySelector(".time_supply")?.value.trim()],
      [
        "tool_id",
        Array.from(document.querySelectorAll(".tool_id option:checked")).map(
          (option) => option.value
        ),
      ],
      ["commentary", phase.querySelector(".commentary")?.value.trim()],
      // ['commentary2', phase.querySelector('.commentary2')?.value.trim()],
      // ['components', collectComponentsData(phase.querySelector('.table.table-bordered'))]
      ["components", collectComponentsData(phase.querySelector(".m9-table"))],
    ];

    // Фильтруем пустые значения и преобразуем массив пар ключ-значение в объект
    const phaseData = Object.fromEntries(
      Object.entries(Object.fromEntries(phaseDataEntries)).filter(
        ([, value]) => value !== "" && value !== undefined
      )
    );

    // Проверяем, существует ли уже объект для dataversionID, и если нет, создаем его
    if (!dataTech[dataversionID]) {
      dataTech[dataversionID] = {}; // Инициализируем объект для dataversion.ID
    }

    // Проверяем, существует ли уже объект 'info' внутри dataTech[dataversionID], и если нет, создаем его
    if (!dataTech["info"]) {
      dataTech["info"] = {}; // Инициализируем объект 'info'
    }

    // Добавляем значения форм с указанными id
    dataTech["info"]["ph"] = document.getElementById("ph").value;
    dataTech["info"]["aroma"] = document.getElementById("aroma").value;
    dataTech["info"]["consistency"] =
      document.getElementById("consistency").value;
    dataTech["info"]["color"] = document.getElementById("color").value;
    dataTech["info"]["viscosity"] = document.getElementById("viscosity").value;
    dataTech["info"]["density"] = document.getElementById("density").value;
    dataTech["info"]["spr"] = document.getElementById("spr").value;

    // Проверяем, существует ли уже объект для 'test'
    if (!dataTech["test"]) {
      dataTech["test"] = {}; // Инициализируем объект 'test'
    }

    const testFields = [
      "ph_tests_start_test_standards",
      "ph_tests_accelerated_aging",
      "ph_tests_temperature_test",
      "ph_tests_normal_conditions",
      "ph_tests_standards",
      "concentration_start_test_standards",
      "concentration_accelerated_aging",
      "concentration_temperature_test",
      "concentration_normal_conditions",
      "concentration_standards",
      "plasmon_resonance_peak_start_test_standards",
      "plasmon_resonance_peak_accelerated_aging",
      "plasmon_resonance_peak_temperature_test",
      "plasmon_resonance_peak_normal_conditions",
      "plasmon_resonance_peak_standards",
      "chroma_start_test_standards",
      "chroma_accelerated_aging",
      "chroma_temperature_test",
      "chroma_normal_conditions",
      "chroma_standards",
      "colloidal_stability_start_test_standards",
      "colloidal_stability_accelerated_aging",
      "colloidal_stability_temperature_test",
      "colloidal_stability_normal_conditions",
      "colloidal_stability_standards",
      "aroma_start_test_standards",
      "aroma_accelerated_aging",
      "aroma_temperature_test",
      "aroma_normal_conditions",
      "aroma_standards",
      "birefringence_start_test_standards",
      "birefringence_accelerated_aging",
      "birefringence_temperature_test",
      "birefringence_normal_conditions",
      "birefringence_standards",
      "temp_testing",
      "test_start_end",
      "notes",
    ];

    testFields.forEach((field) => {
      const inputElement = document.getElementById(field);
      if (inputElement) {
        const value = inputElement.value.trim();
        dataTech["test"][field] = value;
      }
    });

    // Устанавливаем свойство 'weight' для dataTech[dataversionID]
    let weightInput = document.getElementById("global_weight");

    // Проверяем, существует ли уже объект для 'phases' внутри dataTech[dataversionID], и если нет, создаем его
    if (!dataTech["phases"]) {
      dataTech["phases"] = {}; // Инициализируем объект 'phases'
    }

    dataTech["phases"][ID] = phaseData;
    dataTech["ID"] = dataversionID;
    dataTech["weight"] = weightInput.value;
  });

  return filterEmptyValues(dataTech);
};

function copyTableToClipboard(table) {
  let clipboardData = "";
  const rows = table.querySelectorAll("tr");

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td, th");
    cells.forEach((cell, index) => {
      // Пропускаем первый столбец
      if (index === 0) return;

      let cellText = "";
      // Проверяем, содержит ли ячейка select или input
      const selectElement = cell.querySelector("select");
      const inputElement = cell.querySelector("input");

      if (selectElement) {
        // Если ячейка содержит select, копируем текстовое наименование выбранного элемента
        const selectedOption = selectElement.selectedOptions[0];
        cellText = selectedOption ? selectedOption.text : "";
      } else if (inputElement) {
        // Если ячейка содержит input, копируем введенное значение
        cellText = inputElement.value;
      } else {
        // В противном случае копируем текстовое содержимое ячейки
        cellText = cell.textContent || cell.innerText;
        cellText = cellText.trim().replace(/\s+/g, " ");
      }

      // Добавляем значение ячейки в строку данных для буфера обмена
      clipboardData += cellText + "\t";
    });
    // Добавляем перевод строки после каждой строки таблицы
    clipboardData += "\n";
  });

  // Копируем данные в буфер обмена
  navigator.clipboard
    .writeText(clipboardData)
    .then(function () {
      // Создаем всплывающее сообщение
      const popup = document.createElement("div");
      popup.style.position = "fixed";
      popup.style.bottom = "20px";
      popup.style.right = "20px";
      popup.style.padding = "10px";
      popup.style.backgroundColor = "#4CAF50";
      popup.style.color = "white";
      popup.style.borderRadius = "5px";
      popup.style.zIndex = "1000";
      popup.textContent = "Таблица скопирована";
      document.body.appendChild(popup);

      // Удаляем всплывающее сообщение через 3 секунды
      setTimeout(function () {
        document.body.removeChild(popup);
      }, 3000);
    })
    .catch(function (err) {
      console.error("Ошибка при копировании таблицы в буфер обмена: ", err);
    });
}

async function hookPost(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    console.log("Ответ от сервера", responseData);

    if (response.ok) {
    } else {
      alert("Ошибка запроса");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Ошибка", error);
  }
}

async function saveTechMap(dataversion) {
  const data = collectData(dataversion);
  console.log(data);

  let url;
  if (currentPage === "LTK") {
    url = `https://${domain}/9x/app/php/update-tech-map.php?${urlParams}`;
  } else if (currentPage === "PTK") {
    url = `https://${domain}/9x/app/php/save-prod-tech-map.php?${urlParams}`;
    console.log(url);
  } else {
    console.error("Неизвестное значение currentPage");
    return; // Прекращаем выполнение функции, если currentPage не соответствует ожидаемым значениям
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    console.log(responseData);

    if (response.ok) {
      alert("ТК успешно сохранена");
      location.reload();
    } else {
      alert("Ошибка");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Ошибка");
  }
}

function calculateTotalTime(phaseBlock) {
  const components = phaseBlock.querySelectorAll(".component");
  let totalTime = 0;
  components.forEach((component) => {
    const timePrepare =
      parseFloat(component.querySelector(".time_prepare").value) || 0;
    const timeLoad =
      parseFloat(component.querySelector(".time_load").value) || 0;
    const timeProcessing =
      parseFloat(component.querySelector(".time_processing").value) || 0;
    totalTime += timePrepare + timeLoad + timeProcessing;
  });
  const timegeneral = phaseBlock.querySelectorAll(".time_general");
  timegeneral.forEach((element) => {
    element.value = totalTime;
  });
}

function createAdressPhasesMap(dataversion = null) {
  if (!dataversion || !dataversion.phases) {
    // Возвращаем пустой объект, если dataversion или dataversion.phases не существуют
    return {};
  }

  return Object.entries(dataversion.phases).reduce((acc, [k, v]) => {
    // Проверяем, что v не null и у v есть свойство phase_name
    if (v && v.name) {
      acc[v.name] = k;
    }
    return acc;
  }, {});
}

function createPhaseDataBlock(
  phaseData = null,
  selectsData = null,
  _componentData = null
) {
  let phaseDataBlock = document.createElement("div");
  // phaseDataBlock.className = 'card w-100 p-3'; // Добавляем границы
  phaseDataBlock.className = "m9-container";
  phaseDataBlock.style.backgroundColor = "#14ff0714"; // Изменяем цвет контейнера
  phaseDataBlock.style.border = "1px solid silver"; // Добавляем жирную обводку края контейнера

  // Создаем контейнер для кнопки и названия
  let headerContainer = document.createElement("div");
  headerContainer.className =
    "d-flex justify-content-between align-items-center cursor-pointer";

  // Создаем изображение для свертывания
  let collapseImage = document.createElement("img");
  collapseImage.src = "./icons/icons8-развернуть-96.png";
  collapseImage.alt = "Expand";
  collapseImage.style.width = "30px";
  collapseImage.style.height = "30px";
  collapseImage.style.cursor = "pointer";
  collapseImage.title = "Нажмите, чтобы свернуть/развернуть"; // Подсказка

  // Создаем заголовок для свертываемого контейнера
  let phaseDataTitle = document.createElement("h5");
  phaseDataTitle.textContent = "Данные по фазе";

  // Добавляем заголовок и изображение в контейнер
  headerContainer.appendChild(phaseDataTitle);
  headerContainer.appendChild(collapseImage);

  // Добавляем контейнер заголовка в блок данных
  phaseDataBlock.appendChild(headerContainer);

  // Создаем свертываемый контейнер с прозрачностью
  let collapseContainer = document.createElement("div");
  collapseContainer.className = "collapse";
  collapseContainer.id = "collapsePhaseData";
  phaseDataBlock.appendChild(collapseContainer);

  // Функция для свертывания/разворачивания контейнера
  function toggleCollapse() {
    let isCollapsed = collapseContainer.classList.contains("show");
    collapseImage.src = isCollapsed
      ? "./icons/icons8-развернуть-96.png"
      : "./icons/icons8-свернуть-96.png";
    collapseContainer.classList.toggle("show");
  }

  // Добавляем обработчик событий click к collapseImage
  collapseImage.addEventListener("click", toggleCollapse);

  // Добавляем обработчик событий click к headerContainer
  headerContainer.addEventListener("click", function (event) {
    // Проверяем, что клик произошел не на collapseImage, чтобы избежать двойного срабатывания
    if (event.target !== collapseImage) {
      toggleCollapse();
    }
  });

  let row = document.createElement("div");
  row.className = "row";
  let column1 = document.createElement("div");
  column1.className = "col";
  let column2 = document.createElement("div");
  column2.className = "col";
  row.appendChild(column1);
  row.appendChild(column2);
  collapseContainer.appendChild(row);

  let labels1 = [
    "Завоздушивание",
    "Интенсивность перемешивания",
    "Температура загрузки",
    "Рабочая температура",
    "Оснастка",
  ];
  labels1.forEach((labelText) => {
    let formGroup = document.createElement("div");
    formGroup.className =
      "form-group d-flex flex-column justify-content-between w-100 flex-wrap gap-2";
    let label = document.createElement("label");
    label.textContent = labelText;

    if (labelText === "Завоздушивание") {
      let select = document.createElement("select");
      select.className =
        "form-control airing_id width-200 margin-right-200 check-input disabled-ptk m9-input";
      const defaultOption = document.createElement("option");
      defaultOption.textContent = "";
      defaultOption.value = "";
      select.appendChild(defaultOption);
      Object.entries(selectsData.airing).forEach(([key, optionText]) => {
        let option = document.createElement("option");
        option.textContent = optionText;
        option.value = key;
        select.appendChild(option);
      });
      select.addEventListener("change", checkAllInputs);
      formGroup.appendChild(label);
      formGroup.appendChild(select);
      select.value =
        phaseData && phaseData.hasOwnProperty("airing_id")
          ? phaseData.airing_id
          : "";
    } else if (labelText === "Интенсивность перемешивания") {
      let select = document.createElement("select");
      select.className =
        "form-control mixing_intensity_id width-200 margin-right-200 check-input disabled-ptk m9-input";
      const defaultOption = document.createElement("option");
      defaultOption.textContent = "";
      defaultOption.value = "";
      select.appendChild(defaultOption);
      Object.entries(selectsData.mixing_intensity).forEach(
        ([key, optionText]) => {
          let option = document.createElement("option");
          option.textContent = optionText;
          option.value = key;
          select.appendChild(option);
        }
      );
      select.addEventListener("change", checkAllInputs);
      formGroup.appendChild(label);
      formGroup.appendChild(select);
      select.value =
        phaseData && phaseData.hasOwnProperty("mixing_intensity_id")
          ? phaseData.mixing_intensity_id
          : "";
    } else if (labelText === "Температура загрузки") {
      let input = document.createElement("input");
      input.className =
        "form-control time_load width-200 margin-right-200 check-input m9-input";
      input.type = "number";
      input.value =
        phaseData && phaseData.hasOwnProperty("time_load")
          ? phaseData.time_load
          : "";
      input.disabled = false;
      input.addEventListener("input", checkAllInputs);
      formGroup.appendChild(label);
      formGroup.appendChild(input);
    } else if (labelText === "Рабочая температура") {
      let input = document.createElement("input");
      input.className =
        "form-control time_work width-200 margin-right-200 check-input m9-input";
      input.type = "number";
      input.value =
        phaseData && phaseData.hasOwnProperty("time_work")
          ? phaseData.time_work
          : "";
      input.disabled = false;
      input.addEventListener("input", checkAllInputs);
      formGroup.appendChild(label);
      formGroup.appendChild(input);
    } else if (labelText === "Оснастка" && currentPage === "PTK") {
      let select = document.createElement("select");
      select.setAttribute("name", "equipment[]");
      select.setAttribute("multiple", "multiple");
      select.className =
        "form-control equipment_id width-200 margin-right-200 m9-input";
      select.disabled = false;
      const defaultOption = document.createElement("option");
      defaultOption.textContent = "";
      defaultOption.value = "";
      select.appendChild(defaultOption);
      Object.entries(selectsData.equipment_phase).forEach(
        ([key, optionText]) => {
          let option = document.createElement("option");
          option.textContent = optionText;
          option.value = key;
          select.appendChild(option);
        }
      );
      select.addEventListener("change", checkAllInputs);
      formGroup.appendChild(label);
      formGroup.appendChild(select);
      if (Number.isInteger(JSON.parse(phaseData.equipment_id))) {
        select.value =
          phaseData && phaseData.hasOwnProperty("equipment_id")
            ? phaseData.equipment_id
            : "";
      } else {
        const equipmentIds = JSON.parse(phaseData.equipment_id);
        if (Array.isArray(equipmentIds)) {
          equipmentIds.forEach((id) => {
            const option = select.querySelector(`option[value="${id}"]`);
            if (option) {
              option.selected = true;
            }
          });
        }
      }
    }

    column1.appendChild(formGroup);
  });

  let labels2 = [
    "Тип реактора",
    "Тип мешалки",
    "Инструменты",
    "pH фазы",
    "Общее время на фазу (мин)",
  ];
  labels2.forEach((labelText) => {
    let formGroup = document.createElement("div");
    formGroup.className =
      "form-group d-flex flex-column justify-content-between w-100 flex-wrap gap-2";
    let label = document.createElement("label");
    label.textContent = labelText;

    if (labelText === "Тип реактора" && currentPage === "PTK") {
      let select = document.createElement("select");
      select.className =
        "form-control type_of_equipment_id width-200 margin-right-200 check-input m9-input";
      const defaultOption = document.createElement("option");
      defaultOption.textContent = "";
      defaultOption.value = "";
      select.appendChild(defaultOption);
      Object.entries(selectsData.type_of_equipment).forEach(
        ([key, optionText]) => {
          let option = document.createElement("option");
          option.textContent = optionText;
          option.value = key;
          select.appendChild(option);
        }
      );
      select.addEventListener("change", checkAllInputs);
      formGroup.appendChild(label);
      formGroup.appendChild(select);
      console.log(phaseData);
      select.value =
        phaseData && phaseData.hasOwnProperty("type_of_equipment_id")
          ? phaseData.type_of_equipment_id
          : "";
    } else if (labelText === "Тип мешалки") {
      let select = document.createElement("select");
      select.className =
        "form-control mixer_type_id width-200 margin-right-200 check-input m9-input";
      const defaultOption = document.createElement("option");
      defaultOption.textContent = "";
      defaultOption.value = "";
      select.appendChild(defaultOption);
      Object.entries(selectsData.mixer_type_phase).forEach(
        ([key, optionText]) => {
          let option = document.createElement("option");
          option.textContent = optionText;
          option.value = key;
          select.appendChild(option);
        }
      );
      select.addEventListener("change", checkAllInputs);
      formGroup.appendChild(label);
      formGroup.appendChild(select);
      select.value =
        phaseData && phaseData.hasOwnProperty("mixer_type_id")
          ? phaseData.mixer_type_id
          : "";
    } else if (labelText === "Инструменты" && currentPage === "PTK") {
      let select = document.createElement("select");
      select.setAttribute("name", "tools[]");
      select.setAttribute("multiple", "multiple");
      select.className =
        "form-control tool_id width-200 margin-right-200 check-input m9-input";
      const defaultOption = document.createElement("option");
      select.disabled = false;
      defaultOption.textContent = "";
      defaultOption.value = "";
      select.appendChild(defaultOption);
      Object.entries(selectsData.tools_phase).forEach(([key, optionText]) => {
        let option = document.createElement("option");
        option.textContent = optionText;
        option.value = key;
        select.appendChild(option);
      });
      select.addEventListener("change", checkAllInputs);
      formGroup.appendChild(label);
      formGroup.appendChild(select);
      if (Number.isInteger(JSON.parse(phaseData.tool_id))) {
        select.value =
          phaseData && phaseData.hasOwnProperty("tool_id")
            ? phaseData.tool_id
            : "";
      } else {
        const toolIds = JSON.parse(phaseData.tool_id);
        if (Array.isArray(toolIds)) {
          toolIds.forEach((id) => {
            const option = select.querySelector(`option[value="${id}"]`);
            if (option) {
              option.selected = true;
            }
          });
        }
      }
    } else if (labelText === "pH фазы") {
      let input = document.createElement("input");
      input.className =
        "form-control ph width-200 margin-right-200 check-input disabled-ptk m9-input";
      input.value =
        phaseData && phaseData.hasOwnProperty("ph") ? phaseData.ph : "";
      input.disabled = false;
      input.addEventListener("input", checkAllInputs);
      formGroup.appendChild(label);
      formGroup.appendChild(input);
    } else if (
      (labelText === "Общее время на фазу (мин)", currentPage === "PTK")
    ) {
      let input = document.createElement("input");
      input.type = "number"; // Устанавливаем тип ввода как 'number'
      input.className =
        "form-control time_general width-200 margin-right-200 check-input m9-input";
      input.addEventListener("input", checkAllInputs);
      input.value =
        phaseData && phaseData.hasOwnProperty("time_general")
          ? phaseData.time_general
          : "";
      formGroup.appendChild(label);
      formGroup.appendChild(input);
      input.disabled = true;
    }

    column2.appendChild(formGroup);
  });

  // Создаем текстовое поле для комментариев
  let commentInput = document.createElement("input");
  commentInput.type = "text";
  commentInput.placeholder = "Комментарий...";
  commentInput.className = "form-control commentary mt-2 m9-input"; // Добавляем отступ сверху
  commentInput.value =
    phaseData && phaseData.hasOwnProperty("commentary")
      ? phaseData.commentary
      : "";
  collapseContainer.appendChild(commentInput);

  // Добавляем обработчик событий для изменения иконки при сворачивании/разворачивании
  collapseImage.addEventListener("click", function () {
    let isCollapsed = collapseContainer.classList.contains("show");
    collapseImage.innerHTML = isCollapsed
      ? '<img src="./icons/icons8-развернуть-96.png" alt="Expand" style="width: 30px; height: 30px;">'
      : '<img src="./icons/icons8-свернуть-96.png" alt="Collapse" style="width: 30px; height: 30px;">';
  });

  return phaseDataBlock;
}

function createComponentsTable(
  _phaseData = null,
  selectsData = null,
  componentData = null,
  data
) {
  const compDataFull = data.data.components;

  let componentsBlock = document.createElement("div");
  // componentsBlock.className = 'card-body p-3 align-items-center my-2';
  componentsBlock.className = "m9-container";
  componentsBlock.style.cssText =
    "display: flex; flex-direction: column; gap: 20px; overflow-x: auto; max-width: 100vw;";
  componentsBlock.style.backgroundColor = "#07c4ff17"; // Изменяем цвет контейнера
  componentsBlock.style.border = "1px solid silver"; // Добавляем жирную обводку края контейнера

  // Создание флекс-контейнера
  let flexContainer = document.createElement("div");
  flexContainer.style.display = "flex";
  flexContainer.className = "align-items-center";
  flexContainer.style.flexDirection = "row"; // Изменение направления flex-контейнера на 'row'

  // Создание элемента title
  let title = document.createElement("h5");
  title.textContent = "Состав фазы";
  title.className = "m-0";
  flexContainer.appendChild(title);
  componentsBlock.appendChild(flexContainer);

  let input = document.createElement("input");
  input.className = "form-control ml-5 m9-input";
  input.style.width = "130px";
  input.disabled = "disabled";
  flexContainer.appendChild(input);

  let table = document.createElement("table");
  // table.className = 'table table-bordered';
  table.className = "m9-table";
  table.style.cssText = "overflow-x: auto; display: block; max-width: 100%;";

  let headerRow = document.createElement("tr");
  let headers = [
    "<>",
    "№",
    "Название компонента",
    "Объем в продукте, %",
    "Объем в фазе, %",
    "Вес в килограммах",
    "Функция компонента",
    "t режим",
    "pH (Вод-пок)",
    "Способ подачи",
    "Визуальный контроль",
    "Итоговое состояние фазы после ввода компонента",
  ];

  if (currentPage === "PTK") {
    headers.splice(
      7,
      0,
      "Время подготовки",
      "Время загрузки",
      "Время переработки"
    );
  }

  headers.forEach((headerText) => {
    let headerCell = document.createElement("th");
    headerCell.textContent = headerText;
    headerCell.style.whiteSpace = "nowrap";
    headerRow.appendChild(headerCell);
  });
  table.appendChild(headerRow);

  let percent = 0;
  // Создание строк таблицы из существующих данных
  if (componentData !== null) {
    percent = createTableFromData(table, componentData, selectsData);
    percent = percent;
  }
  input.value = percent.toFixed(6) + " %";

  let addButton = document.createElement("button");
  let imgElement = document.createElement("img");
  imgElement.src = "./icons/icons8-add-64.png";
  imgElement.alt = "Добавить компонент";
  addButton.appendChild(imgElement);
  addButton.className = "button-image button-margin block-ptk";
  addButton.id = "addButton";
  addButton.style.cssText = "width:  30px;";
  addButton.onclick = function () {
    console.log("Нажатие на кнопку");
    const componentGood = collectSelectedValuesFromTable();
    console.log("Извлеченные значения:", componentGood);
    if (componentGood.length > 0) {
      addNewRowToTable(table, compDataFull, componentGood, selectsData);
    } else {
      console.log("Нет выбранных компонентов");
    }
  };

  // Создаем div элемент для центрирования кнопки
  let buttonContainer = document.createElement("div");
  buttonContainer.style.cssText =
    "display: flex; justify-content: center; align-items: center;";

  // Добавляем кнопку внутрь div элемента
  buttonContainer.appendChild(addButton);

  // Добавляем div элемент с кнопкой в componentsBlock
  componentsBlock.appendChild(table);
  componentsBlock.appendChild(buttonContainer);

  // Вызовите функцию makeRowsDraggable и передайте ей таблицу компонентов после её создания
  makeRowsDraggable(table, (row = null));

  return componentsBlock;
}

// function collectSelectedValuesFromTable() {
//     const table = document.getElementById('collapsibleTable');
//     if (!table) {
//         console.error('Таблица с id=collapsibleTable не найдена');
//         return [];
//     }

//     const inputs = table.querySelectorAll('.name');
//     console.log('Найденные элементы:', inputs); // Логирование найденных элементов

//     const selectedValues = Array.from(inputs).map(input => input.textContent);
//     console.log('Извлеченные значения:', selectedValues); // Логирование извлеченных значений
//     return selectedValues;
// }

// function collectSelectedValuesFromTable() {
//     console.log('внутри функции');
//     const table = document.getElementById('collapsibleTable');
//     if (!table) {
//         console.error('Таблица с id=collapsibleTable не найдена');
//         return [];
//     }

//     // Используем комбинированный селектор для выбора элементов с классами component и name
//     const inputs = table.querySelectorAll('.component.name');
//     console.log('Найденные элементы:', inputs); // Логирование найденных элементов

//     const selectedValues = Array.from(inputs).map(input => input.textContent);
//     console.log('Извлеченные значения:', selectedValues); // Логирование извлеченных значений
//     return selectedValues;
// }

function collectSelectedValuesFromTable() {
  // Предполагаем, что у каждого select в таблице есть класс 'name' для выбора названия компонента
  const selects = document.querySelectorAll(".component .name");
  const selectedValues = Array.from(selects).map((select) => select.value);
  return selectedValues.filter((value) => value !== ""); // Фильтруем пустые значения
}

//--------------------------------------------------------------------------------------------------------------------------------

function updateTotalPercent() {
  let totalPercent = 0;
  let phaseElements = document.querySelectorAll(".phase");

  phaseElements.forEach((phaseElement) => {
    let componentPercentInputs = phaseElement.querySelectorAll(".percent");
    componentPercentInputs.forEach((input) => {
      totalPercent += parseFloat(input.value);
    });
  });

  return totalPercent;
}

// function updateComponentWeight(phaseElement, event) {
//     let globalPercent = 100;
//     let componentPercentInputs = phaseElement.querySelectorAll('.percent');

//     let totalPercent = updateTotalPercent(); // Обновляем общий вес компонентов

//     console.log('процент всех компонентов: ', totalPercent);

//     // Проверяем, не превышает ли общий вес 100%
//     if (totalPercent > globalPercent) {
//         alert('Общий вес компонентов не может превышать ' + globalPercent);
//         // Возвращаем предыдущее значение только для компонента, который вызвал превышение
//         componentPercentInputs.forEach(input => {
//             if (input === event.target) {
//                 input.value = event.target.previousValue;
//             }
//         });
//     } else {
//         // Обновляем вес компонентов
//         componentPercentInputs.forEach(input => {
//             let globalWeight = parseFloat(document.getElementById('global_weight').value);
//             let percent = parseFloat(input.value);
//             let weight = percent * (1 / 100) * globalWeight;
//             let weightElement = input.closest('tr').querySelector('.componentWeight');
//             weightElement.value = weight.toFixed(6);
//         });
//     }
// }

function updateComponentWeight(phaseElement, event) {
  let globalPercent = 100;
  let componentPercentInputs = phaseElement.querySelectorAll(".percent");

  let totalPercent = updateTotalPercent(); // Обновляем общий вес компонентов

  // Ограничиваем количество знаков после запятой в totalPercent до двух
  totalPercent = parseFloat(totalPercent.toFixed(2));

  console.log("процент всех компонентов: ", totalPercent);

  // Проверяем, не превышает ли общий вес 100%
  if (totalPercent > globalPercent) {
    alert("Общий вес компонентов не может превышать " + globalPercent);
    // Возвращаем предыдущее значение только для компонента, который вызвал превышение
    componentPercentInputs.forEach((input) => {
      if (input === event.target) {
        input.value = event.target.previousValue;
      }
    });
  } else {
    // Обновляем вес компонентов
    componentPercentInputs.forEach((input) => {
      let globalWeight = parseFloat(
        document.getElementById("global_weight").value
      );
      let percent = parseFloat(input.value);
      let weight = percent * (1 / 100) * globalWeight;
      let weightElement = input.closest("tr").querySelector(".componentWeight");
      weightElement.value = weight.toFixed(6);
    });
  }
}

function updatePercentInPhasePer(phaseElement, _event) {
  let componentPercentInputs = phaseElement.querySelectorAll(".percent");
  let totalComponentPercentValue = 0;

  componentPercentInputs.forEach((input) => {
    totalComponentPercentValue += parseFloat(input.value);
  });

  let totalPercentInPhase = 0;

  componentPercentInputs.forEach((input) => {
    totalPercentInPhase += parseFloat(
      input.closest("tr").querySelector(".percentInPhase").value
    );
  });

  componentPercentInputs.forEach((input) => {
    let componentPercentValue = parseFloat(input.value);
    let percentInPhase =
      (componentPercentValue / totalComponentPercentValue) * 100;
    let percentInPhaseElement = input
      .closest("tr")
      .querySelector(".percentInPhase");
    percentInPhaseElement.value = percentInPhase.toFixed(6);
  });
}

function updateFullWeight() {
  let percentInputs = document.querySelectorAll(".percent"),
    totalPercent = 0;

  percentInputs.forEach((input) => {
    let currentValue = parseFloat(input.value), // Округляем до двух знаков после запятой
      tpPf = parseFloat(totalPercent);
    console.log("Добавляемое значение:", currentValue);
    totalPercent = (tpPf + currentValue).toFixed(2); // Преобразуем обратно в число
    console.log("Текущая сумма:", totalPercent);
  });

  console.log("Итоговая сумма до округления:", totalPercent);
  // Округляем итоговую сумму до двух знаков после запятой и преобразуем обратно в число
  totalPercent = parseFloat(totalPercent);
  console.log("Итоговая сумма после округления:", totalPercent);

  if (totalPercent === 99.99) {
    totalPercent = 100;
  }

  let inputfullweight = document.getElementById("full_weight");
  inputfullweight.value = totalPercent;
}

//------------------------------------------------------------------------------------------------------

function updateTotalComponentWeight() {
  let totalComponentWeight = 0;
  let phaseElements = document.querySelectorAll(".phase");

  phaseElements.forEach((phaseElement) => {
    let componentWeightInputs =
      phaseElement.querySelectorAll(".componentWeight");
    componentWeightInputs.forEach((input) => {
      totalComponentWeight += parseFloat(input.value);
    });
  });

  return totalComponentWeight;
}

function updatePercent(phaseElement, event) {
  let globalWeight = parseFloat(document.getElementById("global_weight").value);
  let componentWeightInputs = phaseElement.querySelectorAll(".componentWeight");

  let totalComponentWeight = updateTotalComponentWeight(); // Обновляем общий вес компонентов

  // Проверяем, не превышает ли общий вес 100%
  if (totalComponentWeight > globalWeight) {
    alert("Общий вес компонентов не может превышать " + globalWeight);
    // Возвращаем предыдущее значение только для компонента, который вызвал превышение
    componentWeightInputs.forEach((input) => {
      if (input === event.target) {
        input.value = event.target.previousValue;
      }
    });
  } else {
    // Обновляем проценты
    componentWeightInputs.forEach((input) => {
      let percent = (parseFloat(input.value) / globalWeight) * 100;
      let percentElement = input.closest("tr").querySelector(".percent");
      percentElement.value = percent.toFixed(6);
    });
  }
}

function updateblePercentInPhase(phaseElement, _event) {
  let componentWeightInputs = phaseElement.querySelectorAll(".componentWeight");
  let totalComponentWeightInPhase = 0;

  // Вычисляем сумму значений componentWeight всех компонентов фазы
  componentWeightInputs.forEach((input) => {
    totalComponentWeightInPhase += parseFloat(input.value);
  });

  componentWeightInputs.forEach((input) => {
    let componentWeight = parseFloat(input.value);
    let percentInPhase = (componentWeight / totalComponentWeightInPhase) * 100;
    // console.log(percentInPhase);

    let percentInPhaseElement = input
      .closest("tr")
      .querySelector(".percentInPhase");
    percentInPhaseElement.value = percentInPhase.toFixed(6);
  });
}

function showCustomAlert(message) {
  document.getElementById("customAlert").style.display = "block";
  document.getElementById("customAlertMessage").innerText = message;
  setTimeout(function () {
    document.getElementById("customAlert").style.display = "none";
  }, 1000); // Закрываем через 2 секунды
}

//------------------------------------------------------------------------------------------------------

function createCell(
  type,
  value,
  selectData,
  textContent = null,
  _percentInPhase = null
) {
  let cell = document.createElement("td");
  if (type === "select" && selectData) {
    let select = document.createElement("select");
    select.className = "form-control check-input m9-input"; // Добавляем класс check-input
    select.addEventListener("change", checkAllInputs); // Добавляем обработчик событий

    // Добавляем пустой option в начале
    let emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "";
    select.appendChild(emptyOption);

    Object.entries(selectData).forEach(([key, val]) => {
      let option = document.createElement("option");
      option.value = key;
      option.textContent = val;
      if (value === key) option.selected = true;
      select.appendChild(option);
    });
    cell.appendChild(select);
  } else if (type === "select_block" && selectData) {
    let select = document.createElement("select");
    select.className = "form-control check-input disabled-ptk m9-input"; // Добавляем класс check-input
    select.addEventListener("change", checkAllInputs); // Добавляем обработчик событий

    // Добавляем пустой option в начале
    let emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "";
    select.appendChild(emptyOption);

    Object.entries(selectData).forEach(([key, val]) => {
      let option = document.createElement("option");
      option.value = key;
      option.textContent = val;
      if (value === key) option.selected = true;
      select.appendChild(option);
    });
    cell.appendChild(select);
  } else if (type === "number") {
    let input = document.createElement("input");
    input.type = "number";
    input.className = "form-control check-input m9-input"; // Добавляем класс check-input
    input.addEventListener("input", checkAllInputs); // Добавляем обработчик событий
    input.value = value;
    cell.appendChild(input);
  } else if (type === "text") {
    cell.textContent = value;
  } else if (type === "input") {
    let input = document.createElement("input");
    input.type = "text";
    input.className = "form-control check-input disabled-ptk m9-input"; // Добавляем класс check-input
    input.value = value;
    cell.appendChild(input);
  } else if (type === "time_prepare") {
    let input = document.createElement("input");
    input.type = "number";
    input.className = "form-control check-input time_prepare m9-input"; // Добавляем класс check-input
    input.value = value;
    cell.appendChild(input);
  } else if (type === "time_load") {
    let input = document.createElement("input");
    input.type = "number";
    input.className = "form-control check-input time_load m9-input"; // Добавляем класс check-input
    input.value = value;
    cell.appendChild(input);
  } else if (type === "time_processing") {
    let input = document.createElement("input");
    input.type = "number";
    input.className = "form-control check-input time_processing m9-input"; // Добавляем класс check-input
    input.value = value;
    cell.appendChild(input);
  } else if (type === "select name") {
    let select = document.createElement("select");
    select.className = "form-control check-input copyname m9-input"; // Добавляем класс check-input
    select.addEventListener("change", checkAllInputs); // Добавляем обработчик событий

    let option = document.createElement("option");
    option.value = value;
    option.textContent = textContent;
    select.appendChild(option);

    // Добавляем обработчик событий click к элементу select
    select.addEventListener("click", function () {
      let row = this.parentNode.parentNode;
      let thirdCell = row.cells[2];
      navigator.clipboard.writeText(thirdCell.textContent).then(
        function () {
          showCustomAlert("Название успешно скопировано");
        },
        function (err) {
          console.error("Не удалось скопировать текст: ", err);
        }
      );
    });

    // Добавляем обработчик событий change к элементу select для обновления подсказки
    select.addEventListener("change", function () {
      // Обновляем атрибут title элемента select с выбранным значением
      this.setAttribute("title", this.options[this.selectedIndex].text);
    });

    // Устанавливаем начальное значение атрибута title
    select.setAttribute("title", textContent);

    cell.appendChild(select);

    // Заменяем создание элемента для componentWeight на percent
  } else if (type === "percent") {
    let input = document.createElement("input");
    input.type = "number";
    input.className = "form-control check-input percent disabled-ptk m9-input"; // Используем класс вместо id
    input.min = 0;
    input.max = 100;
    if (["AAA-Test#1"].includes(dataversion.product_code)) {
      input.value = Number(value).toFixed(6);
    } else {
      input.value = (Number(value) * 100).toFixed(6);
    }
    input.addEventListener("input", function (event) {
      let phaseElement = this.closest(".phase");
      updateComponentWeight(phaseElement, event);
      updatePercentInPhasePer(this.closest(".phase"), event);
      updateTotalComponentWeight();
      updateFullWeight();
    });
    input.addEventListener("focus", function (event) {
      event.target.previousValue = parseFloat(event.target.value);
    });
    cell.appendChild(input);
  } else if (type === "percentInPhase") {
    let input = document.createElement("input");
    input.type = "number";
    input.className = "form-control check-input percentInPhase m9-input";
    input.disabled = true;
    cell.appendChild(input);
  } else if (type === "componentWeight") {
    let input = document.createElement("input");
    input.type = "number";
    input.className =
      "form-control check-input componentWeight disabled-ptk m9-input"; // Используем класс вместо id
    input.disabled = false;
    input.min = 0;
    input.max = 100;
    input.addEventListener("input", function (event) {
      let phaseElement = this.closest(".phase");
      updatePercent(phaseElement, event);
      updateblePercentInPhase(phaseElement, event);
      updateTotalComponentWeight();
    });
    input.addEventListener("focus", function (event) {
      event.target.previousValue = parseFloat(event.target.value);
    });
    cell.appendChild(input);
  }
  return cell;
}

async function saveDelete(urlupdate) {
  try {
    const response = await fetch(urlupdate, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Проверяем, что ответ успешный
    if (!response.ok) {
      throw new Error("Ошибка сети или исключение");
    }

    // Извлекаем данные из ответа
    const data = await response.json();

    // Проверяем, успешно ли выполнена операция
    if (data.success === false) {
      // Выводим сообщение об ошибке
      alert("Ошибка: " + data.message);
    } else {
      // Если все прошло успешно, выводим сообщение об успехе
      alert("Операция выполнена успешно.");
    }
  } catch (error) {
    // Обработка ошибок сети или других исключений
    console.error("Ошибка сети или исключение:", error);
  }
}

async function importTechMap(
  urlupdate,
  tableId,
  recipeVersion,
  id,
  currentPage
) {
  try {
    let bodyObject;

    if (currentPage === "LTK") {
      bodyObject = {
        tableId: tableId,
        recipeVersion: recipeVersion,
        id: id,
      };
    } else if (currentPage === "PTK") {
      bodyObject = {
        tableID: tableId,
        ID: id,
      };
    }

    const response = await fetch(urlupdate, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyObject),
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

function addNewRowToTable(table, compDataFull, componentGood, selectsData) {
  let newRow = document.createElement("tr");
  newRow.className = "component";

  // Добавляем ячейку с значком
  let dragCell = document.createElement("td");
  let dragIcon = document.createElement("img");
  dragIcon.setAttribute(
    "src",
    "https://img.icons8.com/ios/100/drag-reorder.png"
  );
  dragIcon.setAttribute("alt", "drag-reorder");
  dragIcon.setAttribute("width", "20");
  dragIcon.setAttribute("height", "20");
  dragCell.appendChild(dragIcon);
  newRow.appendChild(dragCell);

  let newComponentNumberCell = document.createElement("td");
  newComponentNumberCell.textContent =
    table.querySelectorAll(".component").length + 1;
  newRow.appendChild(newComponentNumberCell);

  // Создаем выпадающий список для выбора компонента
  let availableComponents = compDataFull.filter((comp) =>
    componentGood.includes(comp.ID)
  );
  let nameSelectCell = createCell(
    "select",
    null,
    availableComponents.reduce((acc, comp) => {
      acc[comp.ID] = comp.name;
      return acc;
    }, {})
  );
  newRow.appendChild(nameSelectCell);

  // Создаем ячейки для остальных свойств на основе первого доступного компонента
  let firstAvailableComponent = availableComponents[0] || {};
  newRow.appendChild(
    createCell("percent", firstAvailableComponent.percent || "0")
  ); // Объем в продукте, %
  newRow.appendChild(createCell("percentInPhase", "")); // Объем в фазе, %
  newRow.appendChild(createCell("componentWeight", "")); // Вес / кг
  newRow.appendChild(
    createCell(
      "select_block",
      firstAvailableComponent.function_component_id,
      selectsData.function_component
    )
  );
  if (currentPage === "PTK") {
    newRow.appendChild(
      createCell("time_prepare", firstAvailableComponent.time_prepare || "")
    ); // Время подготовки
    newRow.appendChild(
      createCell("time_load", firstAvailableComponent.time_load || "")
    ); // Время загрузки
    newRow.appendChild(
      createCell(
        "time_processing",
        firstAvailableComponent.time_processing || ""
      )
    ); // Время переработки
  }
  newRow.appendChild(
    createCell("number", firstAvailableComponent.temp_mode || "")
  );
  newRow.appendChild(
    createCell("input", firstAvailableComponent.phNorma || "")
  );
  newRow.appendChild(
    createCell(
      "select_block",
      firstAvailableComponent.delivery_method_id,
      selectsData.delivery_method
    )
  );
  newRow.appendChild(
    createCell(
      "select_block",
      firstAvailableComponent.visual_control_id,
      selectsData.visual_control
    )
  );
  newRow.appendChild(
    createCell(
      "select_block",
      firstAvailableComponent.final_state_id,
      selectsData.final_state
    )
  );

  if (currentPage === "LTK") {
    // Кнопка удаления
    let deleteCell = document.createElement("td");
    let deleteImage = document.createElement("img");
    deleteImage.className = "m9-navigation-menu-icon"; // Добавляем класс к иконке
    deleteImage.alt = "Удалить";
    deleteImage.src = "./img/trash.svg";
    deleteImage.onclick = function () {
      newRow.remove();
    };
    deleteCell.appendChild(deleteImage);
    newRow.appendChild(deleteCell);
  }

  // Добавляем обработчик событий для нового input'а с классом 'percent'
  const newPercentInput = newRow.querySelector(".percent");
  newPercentInput.addEventListener("input", () => {
    updateTotalPercent(table.closest(".phase"));
  });

  table.appendChild(newRow);

  // В функции addNewRowToTable, после добавления newRow в таблицу:
  makeRowsDraggable(null, newRow);
}

function createTableFromData(
  table,
  componentData = null,
  selectsData,
  percent = 0
) {
  // Сортируем компоненты по их порядку
  const sortedComponents = Object.values(componentData).sort(
    (a, b) => a.number - b.number
  );
  // Создаем строки таблицы для каждого компонента
  sortedComponents.forEach((component, index) => {
    percent += parseFloat(component.percent);
    let color = "";
    Object.values(componentData).forEach((comp) => {
      if (comp.component_id === component.component_id) {
        color = comp.isDeleted === "1" ? "rgb(193 119 119)" : "";
      }
    });
    let row = document.createElement("tr");
    row.style.backgroundColor = color;
    row.setAttribute("db", component.ID); // Предположим, что ID компонента находится в свойстве ID
    row.className = "component";

    // Добавляем ячейку с значком перетаскивания
    let dragCell = document.createElement("td");
    let dragIcon = document.createElement("img");
    dragIcon.setAttribute(
      "src",
      "https://img.icons8.com/ios/100/drag-reorder.png"
    );
    dragIcon.setAttribute("alt", "drag-reorder");
    dragIcon.setAttribute("width", "20");
    dragIcon.setAttribute("height", "20");
    dragCell.appendChild(dragIcon);
    row.appendChild(dragCell);

    row.appendChild(createCell("text", index + 1)); // Номер компонента
    row.appendChild(
      createCell(
        "select name",
        component.component_id,
        selectsData,
        component.name
      )
    );
    row.appendChild(createCell("percent", component.percent || "0")); // Объем в продукте, %
    row.appendChild(
      createCell("percentInPhase", component.percentInPhase || "0")
    ); // Объем в фазе, %
    row.appendChild(
      createCell("componentWeight", component.componentWeight || "0")
    ); // Вес / кг
    row.appendChild(
      createCell(
        "select_block",
        component.function_component_id,
        selectsData.function_component
      )
    ); // Функция компонента
    if (currentPage === "PTK") {
      row.appendChild(
        createCell("time_prepare", component.time_prepare || "0")
      ); // Время подготовки
      row.appendChild(createCell("time_load", component.time_load || "0")); // Время загрузки
      row.appendChild(
        createCell("time_processing", component.time_processing || "0")
      ); // Время переработки
    }
    row.appendChild(createCell("number", component.temp_mode || "0")); // Температурный режим
    row.appendChild(createCell("input", component.phNorma || "0")); // pH (Водородный показатель)
    row.appendChild(
      createCell(
        "select_block",
        component.delivery_method_id,
        selectsData.delivery_method
      )
    ); // Способ подачи
    row.appendChild(
      createCell(
        "select_block",
        component.visual_control_id,
        selectsData.visual_control
      )
    ); // Визуальный контроль
    row.appendChild(
      createCell(
        "select_block",
        component.final_state_id,
        selectsData.final_state
      )
    ); // Итоговое состояние фазы после ввода компонента

    if (currentPage === "LTK") {
      // Кнопка удаления
      let deleteCell = document.createElement("td");
      let deleteImage = document.createElement("img");
      deleteImage.className = "m9-navigation-menu-icon"; // Добавляем класс к иконке
      deleteImage.alt = "Удалить";
      deleteImage.src = "./img/trash.svg";
      deleteImage.onclick = function () {
        newRow.remove();
      };
      // Добавляем изображение в кнопку
      deleteImage.onclick = function () {
        let param = component.ID; // Получаем ID компонента
        console.log(param);
        let urlupdate = `https://${domain}/9x/app/php/delete-phase-component.php?${urlParams}&component_id=${param}`;
        saveDelete(urlupdate); // Вызываем функцию saveDelete с ID компонента
        row.remove(); // Удаляем строку из таблицы
      };

      deleteCell.appendChild(deleteImage);
      row.appendChild(deleteCell);
    }

    table.appendChild(row);
  });
  return percent;
}

function createMixingModeBlock(
  phaseData = null,
  selectsData = null,
  _componentData = null,
  dataversion = null
) {
  let mixingModeBlock = document.createElement("div");
  // mixingModeBlock.className = 'card w-100 p-3';
  mixingModeBlock.className = "m9-container";
  mixingModeBlock.style.backgroundColor = "#fd07ff14"; // Изменяем цвет контейнера
  mixingModeBlock.style.border = "1px solid silver"; // Добавляем жирную обводку края контейнера

  // Создаем контейнер для кнопки и названия
  let headerContainer = document.createElement("div");
  headerContainer.className =
    "d-flex justify-content-between align-items-center cursor-pointer";

  // Создаем изображение для свертывания
  let collapseImage = document.createElement("img");
  collapseImage.src = "./icons/icons8-развернуть-96.png";
  collapseImage.alt = "Expand";
  collapseImage.style.width = "30px";
  collapseImage.style.height = "30px";
  collapseImage.style.cursor = "pointer";
  collapseImage.title = "Нажмите, чтобы свернуть/развернуть"; // Подсказка

  // Создаем заголовок для свертываемого контейнера
  let phaseMixingTitle = document.createElement("h5");
  phaseMixingTitle.textContent = "Режим смешения";

  // Добавляем заголовок и изображение в контейнер
  headerContainer.appendChild(phaseMixingTitle);
  headerContainer.appendChild(collapseImage);

  // Добавляем контейнер заголовка в блок данных
  mixingModeBlock.appendChild(headerContainer);

  // Создаем свертываемый контейнер с прозрачностью
  let collapseContainer = document.createElement("div");
  collapseContainer.className = "collapse";
  collapseContainer.id = "collapsePhaseData";
  mixingModeBlock.appendChild(collapseContainer);

  // Функция для свертывания/разворачивания контейнера
  function toggleCollapse() {
    let isCollapsed = collapseContainer.classList.contains("show");
    collapseImage.src = isCollapsed
      ? "./icons/icons8-развернуть-96.png"
      : "./icons/icons8-свернуть-96.png";
    collapseContainer.classList.toggle("show");
  }

  // Добавляем обработчик событий click к collapseImage
  collapseImage.addEventListener("click", function (event) {
    event.stopPropagation(); // Предотвращаем всплытие события
    toggleCollapse();
  });

  // Добавляем обработчик событий click к headerContainer
  headerContainer.addEventListener("click", function (event) {
    // Проверяем, что клик произошел не на collapseImage, чтобы избежать двойного срабатывания
    if (event.target !== collapseImage) {
      toggleCollapse();
    }
  });

  let row = document.createElement("div");
  row.className = "row";
  let column1 = document.createElement("div");
  column1.className = "col";
  let column2 = document.createElement("div");
  column2.className = "col";
  row.appendChild(column1);
  row.appendChild(column2);

  let labels1 = [
    "Адресная фаза",
    "Интенсивность перемешивания",
    "t подачи",
    "Скорость вращения (обороты/сек)",
  ];
  labels1.forEach((labelText) => {
    let formGroup = document.createElement("div");
    formGroup.className =
      "form-group d-flex flex-column justify-content-between w-100 flex-wrap gap-2";
    let label = document.createElement("label");
    label.textContent = labelText;

    if (labelText === "Адресная фаза") {
      const label = document.createElement("label");
      label.textContent = labelText;
      formGroup.appendChild(label);
      const select = document.createElement("select");
      select.id = "adress_phase_id";
      select.className =
        "form-control adress_phase_id width-200 margin-right-200 check-input disabled-ptk m9-input";
      const defaultOption = document.createElement("option");
      defaultOption.textContent = "";
      defaultOption.value = "";
      select.appendChild(defaultOption);
      adressPhases = createAdressPhasesMap(dataversion);
      for ([k, v] of Object.entries(adressPhases)) {
        const option = document.createElement("option");
        option.value = v;
        option.textContent = k;
        select.appendChild(option);
      }
      formGroup.appendChild(select);
      select.value =
        phaseData && phaseData.hasOwnProperty("adress_phase_id")
          ? phaseData.adress_phase_id
          : "";
    } else if (
      labelText === "Интенсивность перемешивания" &&
      currentPage === "PTK"
    ) {
      //feed_type_id
      let select = document.createElement("select");
      select.className =
        "form-control feed_type_id width-200 margin-right-200 m9-input";
      const defaultOption = document.createElement("option");
      defaultOption.textContent = "";
      defaultOption.value = "";
      select.appendChild(defaultOption);
      Object.entries(selectsData.feed_type).forEach(([key, optionText]) => {
        let option = document.createElement("option");
        option.textContent = optionText;
        option.value = key;
        select.appendChild(option);
      });
      select.disabled = false;
      select.addEventListener("change", checkAllInputs);
      formGroup.appendChild(label);
      formGroup.appendChild(select);
      select.value =
        phaseData && phaseData.hasOwnProperty("feed_type_id")
          ? phaseData.feed_type_id
          : "";
    } else if (labelText === "t подачи") {
      let input = document.createElement("input");
      input.className =
        "form-control time_supply width-200 margin-right-200 check-input disabled-ptk m9-input";
      input.type = "number";
      input.value =
        phaseData && phaseData.hasOwnProperty("time_supply")
          ? phaseData.time_supply
          : "";
      input.addEventListener("input", checkAllInputs);
      input.disabled = false;
      formGroup.appendChild(label);
      formGroup.appendChild(input);
    } else if (
      labelText === "Скорость вращения (обороты/сек)" &&
      currentPage === "PTK"
    ) {
      let input = document.createElement("input");
      input.className =
        "form-control rotation_mixing width-200 margin-right-200 check-input m9-input";
      input.type = "number";
      input.value =
        phaseData && phaseData.hasOwnProperty("rotation_mixing")
          ? phaseData.rotation_mixing
          : "";
      input.addEventListener("input", checkAllInputs);
      input.disabled = false;
      formGroup.appendChild(label);
      formGroup.appendChild(input);
    }
    column1.appendChild(formGroup);
  });

  let labels2 = ["Время на смешение", "Внешний вид фазы", "Способ подачи"];
  labels2.forEach((labelText) => {
    let formGroup = document.createElement("div");
    formGroup.className =
      "form-group d-flex flex-column justify-content-between w-100 flex-wrap gap-2";
    let label = document.createElement("label");
    label.textContent = labelText;

    if (labelText === "Внешний вид фазы") {
      let select = document.createElement("select");
      select.className =
        "form-control appearance_id width-200 margin-right-200 check-input disabled-ptk m9-input";
      const defaultOption = document.createElement("option");
      defaultOption.textContent = "";
      defaultOption.value = "";
      select.appendChild(defaultOption);
      Object.entries(selectsData.appearance).forEach(([key, optionText]) => {
        let option = document.createElement("option");
        option.textContent = optionText;
        option.value = key;
        select.appendChild(option);
      });
      select.disabled = false;
      select.addEventListener("change", checkAllInputs);
      formGroup.appendChild(label);
      formGroup.appendChild(select);
      select.value =
        phaseData && phaseData.hasOwnProperty("appearance_id")
          ? phaseData.appearance_id
          : "";
    } else if (labelText === "Время на смешение") {
      let input = document.createElement("input");
      input.className =
        "form-control time_to_mix width-200 margin-right-200 check-input m9-input";
      input.type = "number";
      input.value =
        phaseData && phaseData.hasOwnProperty("time_to_mix")
          ? phaseData.time_to_mix
          : "";
      input.disabled = false;
      input.addEventListener("input", checkAllInputs);
      formGroup.appendChild(label);
      formGroup.appendChild(input);
    } else if (labelText === "Способ подачи") {
      let select = document.createElement("select");
      select.className =
        "form-control delivery_method_id width-200 margin-right-200 check-input disabled-ptk m9-input";
      const defaultOption = document.createElement("option");
      defaultOption.textContent = "";
      defaultOption.value = "";
      select.appendChild(defaultOption);
      Object.entries(selectsData.delivery_method).forEach(
        ([key, optionText]) => {
          let option = document.createElement("option");
          option.textContent = optionText;
          option.value = key;
          select.appendChild(option);
        }
      );
      select.disabled = false;
      select.addEventListener("change", checkAllInputs);
      formGroup.appendChild(label);
      formGroup.appendChild(select);
      select.value =
        phaseData && phaseData.hasOwnProperty("delivery_method_id")
          ? phaseData.delivery_method_id
          : "";
    }

    column2.appendChild(formGroup);
  });

  collapseContainer.appendChild(row);

  // // Создаем текстовое поле для комментариев
  // let commentInput = document.createElement('input');
  // commentInput.type = 'text';
  // commentInput.placeholder = 'Комментарий...';
  // commentInput.className = 'form-control commentary2 mt-2 m9-input'; // Добавляем отступ сверху
  // commentInput.value = phaseData && phaseData.hasOwnProperty('commentary2') ? phaseData.commentary2 : '';
  // collapseContainer.appendChild(commentInput);

  // Добавляем обработчик событий для изменения иконки при сворачивании/разворачивании
  collapseImage.addEventListener("click", function () {
    let isCollapsed = collapseContainer.classList.contains("show");
    collapseImage.innerHTML = isCollapsed
      ? '<img src="./icons/icons8-развернуть-96.png" alt="Expand" style="width:   30px; height:   30px;">'
      : '<img src="./icons/icons8-свернуть-96.png" alt="Collapse" style="width:   30px; height:   30px;">';
  });

  return mixingModeBlock;
}

function addTableRow(tbody, data, dataversion) {
  const headerComponents = dataversion.header;
  // Сортировка компонентов по убыванию component.percent
  const sortedHeaderComponents = Object.values(headerComponents).sort(
    (a, b) => {
      if (a.percent > b.percent) return -1;
      if (a.percent < b.percent) return 1;
      return 0;
    }
  );

  sortedHeaderComponents.forEach((component) => {
    let element = data.data.components.find(
      (comp) => comp.ID === component.component_id
    );
    let сolor = "";
    if (element !== undefined) {
      сolor = element.isDeleted === "1" ? "rgb(193 119 119)" : "";
    }
    const row = document.createElement("tr");
    row.style.backgroundColor = сolor;

    // Создаем ячейку с select для INCI
    const inciCell = document.createElement("td");
    const inciSelect = createSelectElement(
      component.inci,
      data.data.components,
      "inci",
      headerComponents,
      component.component_id
    );
    inciCell.appendChild(inciSelect);

    // Создаем ячейку с select для Chemical Name
    const chemicalNameCell = document.createElement("td");
    const chemicalNameSelect = createSelectElement(
      component.chemicalName,
      data.data.components,
      "chemicalName",
      headerComponents,
      component.component_id
    );
    chemicalNameCell.appendChild(chemicalNameSelect);

    // Создаем ячейку с select для Provider
    const providerCell = document.createElement("td");
    const providerSelect = createSelectElement(
      component.provider,
      data.data.components,
      "provider",
      headerComponents,
      component.component_id
    );
    providerCell.appendChild(providerSelect);

    // Создаем ячейку с select для Name
    const nameCell = document.createElement("td");
    const nameSelect = createSelectElement(
      component.name,
      data.data.components,
      "name",
      headerComponents,
      component.component_id
    );
    nameCell.appendChild(nameSelect);

    row.appendChild(inciCell);
    row.appendChild(chemicalNameCell);
    row.appendChild(providerCell);
    row.appendChild(nameCell);

    addDeleteButton(row); // Добавляем кнопку удаления
    tbody.appendChild(row); // Добавляем строку в tbody
  });
}

// function addTableRow(tbody, data, dataversion) {
//     const headerComponents = dataversion.header;
//     // Сортировка компонентов по убыванию component.percent
//     const sortedHeaderComponents = Object.values(headerComponents).sort((a, b) => {
//         if (a.percent > b.percent) return -1;
//         if (a.percent < b.percent) return 1;
//         return 0;
//     });

//     sortedHeaderComponents.forEach(component => {
//         let element = data.data.components.find(comp => comp.ID === component.component_id);
//         let сolor = '';
//         if (element !== undefined) {
//             сolor = element.isDeleted === '1' ? 'rgb(193 119 119)' : '';
//         }
//         const row = document.createElement('tr');
//         row.style.backgroundColor = сolor;

//         // Создаем ячейку с select для INCI
//         const inciCell = document.createElement('td');
//         const inciSelect = createSelectElement(component.inci, data.data.components, 'inci', headerComponents);
//         inciCell.appendChild(inciSelect);

//         // Создаем ячейку с select для Chemical Name
//         const chemicalNameCell = document.createElement('td');
//         const chemicalNameSelect = createSelectElement(component.chemicalName, data.data.components, 'chemicalName', headerComponents);
//         chemicalNameCell.appendChild(chemicalNameSelect);

//         // Создаем ячейку с select для Provider
//         const providerCell = document.createElement('td');
//         const providerSelect = createSelectElement(component.provider, data.data.components, 'provider', headerComponents);
//         providerCell.appendChild(providerSelect);

//         // Создаем ячейку с select для Name
//         const nameCell = document.createElement('td');
//         const nameSelect = createSelectElement(component.name, data.data.components, 'name', headerComponents);
//         nameCell.appendChild(nameSelect);

//         row.appendChild(inciCell);
//         row.appendChild(chemicalNameCell);
//         row.appendChild(providerCell);
//         row.appendChild(nameCell);

//         addDeleteButton(row); // Добавляем кнопку удаления
//         tbody.appendChild(row); // Добавляем строку в tbody
//     });
// }

// function createSelectElement(selectedValue, components, propertyName, headerComponents) {
//     const select = document.createElement('select');
//     select.classList.add('form-control', 'm9-input');
//     select.disabled = true;

//     // Добавляем опции в select
//     Object.values(headerComponents).forEach(headerComponent => {
//         const component = components.find(c => c.ID === headerComponent.component_id);
//         if (component) {
//             const option = document.createElement('option');
//             option.value = component.ID;
//             option.textContent = component[propertyName];
//             option.selected = component[propertyName] === selectedValue;
//             select.appendChild(option);
//         }
//     });

//     return select;
// }

function createSelectElement(
  selectedValue,
  _components,
  propertyName,
  _headerComponents,
  id
) {
  const input = document.createElement("input");
  input.classList.add("form-control", "m9-input", "component"); // Добавляем начальные классы
  // Добавляем класс, имя которого хранится в переменной propertyName
  input.classList.add(propertyName);
  // Добавляем атрибут disabled
  input.disabled = true;
  // Храним id в атрибуте data-id
  input.textContent = id;
  // Отображаем selectedValue в поле ввода
  input.value = selectedValue;

  return input;
}

// Функция для добавления кнопки удаления в строку
function addDeleteButton(row) {
  // const deleteCell = document.createElement('td');
  // const deleteButton = document.createElement('button');
  // deleteButton.className = 'btn block-ptk';
  // // deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
  // const deleteImage = document.createElement('img');
  // deleteImage.setAttribute('src', 'https://'+domain+'/9x/tech-map/icons/icons8-cross-mark-96.png');
  // deleteImage.setAttribute('width', '25');
  // deleteImage.setAttribute('height', '25');
  // deleteImage.setAttribute('alt', 'Удалить');
  // deleteButton.appendChild(deleteImage);
  // deleteButton.onclick = function () {
  //     row.remove(); // Удаляем строку из таблицы
  // };

  // deleteCell.appendChild(deleteButton);
  // row.appendChild(deleteCell);

  if (currentPage === "LTK") {
    // Кнопка удаления
    let deleteCell = document.createElement("td");
    const deleteImage = document.createElement("img");
    deleteImage.className = "m9-navigation-menu-icon"; // Добавляем класс к иконке
    deleteImage.alt = "Удалить";
    deleteImage.src = "./img/trash.svg";
    deleteImage.onclick = function () {
      newRow.remove();
    };
    deleteCell.appendChild(deleteImage);
    row.appendChild(deleteCell);
  }
}

let selectedValues = {};

function createEmptyComponentRow(tbody, data, _dataversion) {
  const row = document.createElement("tr");
  const inciSelect = document.createElement("select");
  const compositionSelect = document.createElement("select");
  const providerSelect = document.createElement("select");
  const invoiceNameSelect = document.createElement("select");
  invoiceNameSelect.classList.add("name");
  const selects = [
    inciSelect,
    compositionSelect,
    providerSelect,
    invoiceNameSelect,
  ];

  selects.forEach((select) => {
    select.classList.add("m9-select");
    const cell = document.createElement("td");
    cell.appendChild(select);
    row.appendChild(cell);
  });

  tbody.appendChild(row);

  // Инициализация Selectize для всех выпадающих списков

  // Обновление опций селекта и автоматический выбор опции, если это необходимо
  function updateSelectOptionsAndAutoSelect($select, options, dependentSelect) {
    console.log($select);
    $select[0].selectize.clearOptions();
    $select[0].selectize.addOption(options);
    $select[0].selectize.clear(); // Очищаем предыдущие значения
    if (dependentSelect) {
      dependentSelect[0].selectize.clearOptions();
    }
    if (options.length === 1) {
      $select[0].selectize.setValue(options[0].value);
    }
  }

  const inciOptions = Array.from(
    new Map(
      data.data.components
        .filter((component) => component.inci && component.isDeleted === "0")
        .map((component) => [
          component.inci,
          { value: component.ID, text: component.inci },
        ])
    ).values()
  );

  updateSelectOptionsAndAutoSelect(
    $(inciSelect),
    inciOptions,
    $(compositionSelect)
  );

  let selectedInciValue = null;

  // Обработчик для inciSelect
  $(inciSelect)[0].selectize.on("change", function () {
    selectedInciValue = this.getValue(); // Сохраняем выбранное значение inci
    console.log("selectedInciValue:", selectedInciValue);

    // Находим компонент с ID, соответствующим selectedValue
    const selectedComponent = data.data.components.find(
      (component) => component.ID === selectedInciValue
    );

    if (selectedComponent) {
      selectedTextinci = selectedComponent.inci; // Получаем значение inci из выбранного компонента
      console.log("selectedTextinci:", selectedTextinci); // Логируем текст выбранного элемента

      // Фильтруем компоненты по выбранному тексту и состоянию isDeleted
      const filteredComponents = data.data.components.filter(
        (component) =>
          component.inci === selectedTextinci && component.isDeleted === "0"
      );
      console.log("filteredComponents:", filteredComponents);

      const chemicalNameOptions = filteredComponents.map((component) => ({
        value: component.ID,
        text: component.chemicalName,
      }));
      console.log("chemicalNameOptions:", chemicalNameOptions);

      updateSelectOptionsAndAutoSelect(
        $(compositionSelect),
        chemicalNameOptions,
        $(providerSelect)
      );
      updateSelectOptionsAndAutoSelect(
        $(providerSelect),
        [],
        $(invoiceNameSelect)
      ); // Очищаем опции providerSelect и invoiceNameSelect
      updateSelectOptionsAndAutoSelect($(invoiceNameSelect), [], null); // Очищаем опции invoiceNameSelect
    } else {
      console.log("Компонент с таким ID не найден:", selectedInciValue);
    }
  });

  // Обработчик для compositionSelect
  $(compositionSelect)[0].selectize.on("change", function () {
    selectedChemicalNameValue = this.getValue(); // Сохраняем выбранное значение chemicalName
    console.log("selectedChemicalName:", selectedChemicalNameValue);

    // Находим компонент с ID, соответствующим selectedValue
    const selectedComponent = data.data.components.find(
      (component) => component.ID === selectedChemicalNameValue
    );

    if (selectedComponent) {
      selectedTextchemicalName = selectedComponent.chemicalName; // Изменено на chemicalName
      console.log("selectedTextchemicalName:", selectedTextchemicalName);

      // Фильтруем компоненты по inciValue и selectedText
      const filteredComponents = data.data.components.filter(
        (component) =>
          component.inci === selectedTextinci &&
          component.chemicalName === selectedTextchemicalName &&
          component.isDeleted === "0"
      );
      console.log("Filtered components:", filteredComponents);

      // Проверяем, что фильтрация вернула результаты
      if (filteredComponents.length > 0) {
        // Создаем массив опций для providerSelect, используя значения provider из отфильтрованных компонентов
        const providerOptions = filteredComponents.reduce((acc, component) => {
          if (!acc.some((option) => option.value === component.provider)) {
            acc.push({ value: component.ID, text: component.provider });
          }
          return acc;
        }, []);
        console.log("providerOptions:", providerOptions);

        // Обновляем опции и автоматически выбираем первую опцию, если она единственная
        updateSelectOptionsAndAutoSelect(
          $(providerSelect),
          providerOptions,
          $(invoiceNameSelect)
        );
        updateSelectOptionsAndAutoSelect($(invoiceNameSelect), [], null); // Очищаем опции invoiceNameSelect
      } else {
        console.log(
          `No matching components found for selectedTextinci: ${selectedTextinci} and selectedTextchemicalName: ${selectedTextchemicalName}.`
        );
      }
    } else {
      console.log("Компонент с таким ID не найден:", selectedChemicalNameValue);
    }
  });

  // Обработчик для providerSelect
  $(providerSelect)[0].selectize.on("change", function () {
    selectedProviderValue = this.getValue(); // Сохраняем выбранное значение provider
    console.log("Selected provider:", selectedProviderValue);

    // Находим компонент с ID, соответствующим selectedValue
    const selectedComponent = data.data.components.find(
      (component) => component.ID === selectedProviderValue
    );

    if (selectedComponent) {
      selectedTextprovider = selectedComponent.provider; // Получаем значение provider из выбранного компонента
      console.log("Selected text:", selectedTextprovider);

      // Фильтруем компоненты по inciValue, chemicalNameValue и selectedTextprovider
      const filteredComponents = data.data.components.filter(
        (component) =>
          component.inci === selectedTextinci &&
          component.chemicalName === selectedTextchemicalName &&
          component.provider === selectedTextprovider &&
          component.isDeleted === "0"
      );
      console.log("Filtered components:", filteredComponents);

      // Создаем массив опций для invoiceNameSelect, используя значения name из отфильтрованных компонентов
      const invoiceNameOptions = filteredComponents.map((component) => ({
        value: component.ID,
        text: component.name,
      }));
      console.log("Invoice name select options:", invoiceNameOptions);

      updateSelectOptionsAndAutoSelect(
        $(invoiceNameSelect),
        invoiceNameOptions,
        null
      );
    } else {
      console.log(
        "Компонент с таким provider не найден:",
        selectedProviderValue
      );
    }
  });

  // Кнопка удаления
  let deleteCell = document.createElement("td");
  deleteImage.className = "m9-navigation-menu-icon"; // Добавляем класс к иконке
  deleteImage.alt = "Удалить";
  deleteImage.src = "./img/trash.svg";
  deleteImage.onclick = function () {
    row.remove();
  };
  deleteCell.appendChild(deleteImamage);
  row.appendChild(deleteCell);
}

function makeRowsDraggable(table, row = null) {
  let rowsToMakeDraggable;
  if (row) {
    // Если передана конкретная строка, работаем только с ней
    rowsToMakeDraggable = [row];
  } else if (table) {
    // Если передана таблица, работаем со всеми её строками, исключая первую
    rowsToMakeDraggable = table.querySelectorAll("tr:not(:first-child)");
  } else {
    // Если ничего не передано, выходим из функции
    return;
  }

  rowsToMakeDraggable.forEach((row) => {
    row.setAttribute("draggable", true);
    row.style.cursor = "grab"; // Изменение курсора

    row.addEventListener("dragstart", function (e) {
      draggedRow = this;
      e.dataTransfer.setData("text/plain", "");
      this.classList.add("dragging"); // Применяем стиль для перетаскиваемой строки
    });

    row.addEventListener("dragover", function (e) {
      e.preventDefault();
      this.classList.add("drag-over"); // Подсветка целевой строки
    });

    row.addEventListener("dragleave", function () {
      this.classList.remove("drag-over");
    });

    row.addEventListener("drop", function (e) {
      e.preventDefault();
      if (draggedRow !== this) {
        let draggedRowIndex = [...this.parentNode.rows].indexOf(draggedRow);
        let targetRowIndex = [...this.parentNode.rows].indexOf(this);

        if (draggedRowIndex < targetRowIndex) {
          this.parentNode.insertBefore(draggedRow, this.nextSibling);
        } else {
          this.parentNode.insertBefore(draggedRow, this);
        }
      }
      this.classList.remove("drag-over");
    });

    row.addEventListener("dragend", function () {
      draggedRow = null;
      this.parentNode.querySelectorAll("tr").forEach((row) => {
        row.classList.remove("dragging"); // Убираем стиль перетаскиваемой строки
        row.classList.remove("drag-over"); // Убираем подсветку
      });
    });
  });
}

//--------------------------------------Разворачивывание таблицы с данными------------------

function updateCollapsibleTableContainer(
  collapsibleContainer,
  data,
  dataversion
) {
  // Находим tbody внутри контейнера и очищаем его
  const tbody = collapsibleContainer.querySelector("tbody");
  tbody.innerHTML = "";

  // Добавляем условие для проверки существования dataversion.header
  if (dataversion && dataversion.header) {
    addTableRow(tbody, data, dataversion);
  }

  // Находим кнопку добавления в контейнере и обновляем ее обработчик событий
  const addButton = collapsibleContainer.querySelector(".m9-add-component");

  // Удаляем предыдущий обработчик события 'click', если он существует
  addButton.removeEventListener("click", addButton.onclick);

  // Добавляем новый обработчик события для добавления одной новой строки
  addButton.onclick = function () {
    createEmptyComponentRow(tbody, data, dataversion);
    const selectedValues = collectSelectedValuesFromTable();
    console.log(selectedValues);
  };
}

function updateOutputControlCollapsibleContainer(
  collapsibleOutputContainer,
  data,
  dataversion
) {
  // Находим tbody внутри контейнера и очищаем его
  const tbody = collapsibleOutputContainer.querySelector("tbody");
  tbody.innerHTML = "";

  // Добавляем условие для проверки существования dataversion.header
  if (dataversion && dataversion.header) {
    addTableRow(tbody, data, dataversion);
  }
  // Находим кнопку добавления в контейнере и обновляем ее обработчик событий
  const addButton =
    collapsibleOutputContainer.querySelector(".m9-add-component");
  // Удаляем предыдущий обработчик события 'click', если он существует
  addButton.removeEventListener("click", addButton.onclick);
  // Добавляем новый обработчик события для добавления одной новой строки
  addButton.onclick = function () {
    createEmptyComponentRow(tbody, data, dataversion);
    const selectedValues = collectSelectedValuesFromTable();
    console.log(selectedValues);
  };
}

const getStringSostav = (headerComponents) => {
  // Извлекаем элементы компонентов из входного объекта
  const componentEls = headerComponents["header"];
  console.log(componentEls); // Лог для отладки

  // Инициализируем массив для хранения обработанных данных компонентов
  let components = [];

  // Заполняем массив компонентов объектами, содержащими inci и percent
  for (const componentEl of componentEls) {
    components.push({ inci: componentEl.inci, percent: componentEl.percent });
  }

  // Сортируем массив компонентов по убыванию по свойству percent
  components.sort((a, b) => b.percent - a.percent);

  // Инициализируем массив для хранения строк inci от каждого компонента
  let inciStrings = [];

  // Извлекаем и объединяем строки inci от всех компонентов
  for (component of components) {
    // Разделяем строку inci на массив отдельных компонентов
    const individualIncis = component.inci.split(", ");
    // Добавляем каждый отдельный компонент в массив inciStrings
    inciStrings = [...inciStrings, ...individualIncis];
  }

  // Удаляем дубликаты и объединяем строки inci в одну строку
  const uniqueInciString = [...new Set(inciStrings)].join(", ");

  // Возвращаем результат в виде строки уникальных значений inci
  return uniqueInciString;
};

// Фаза 1. Аккордеон Компоненты
function createCollapsibleTableContainer(data = null, dataversion = null) {
  const accordion = document.createElement("div");
  accordion.className += "accordion border-radius box-shadow";

  // Accordion header
  const accordionHeader = document.createElement("div");
  accordionHeader.className +=
    "accordion-header d-flex justify-content-between align-items-center py-3 cursor-pointer";

  // Header left side: img, text
  const accordionLeft = document.createElement("div");
  accordionLeft.className += "d-flex align-items-center";

  const accordionLeftImg = document.createElement("img");
  accordionLeftImg.className = "ml-3";
  accordionLeftImg.src = "./img/accordion/dataflow.svg";
  accordionLeftImg.alt = "Компоненты";

  const accordionLeftText = document.createElement("p");
  accordionLeftText.className += "h4 m-0 ml-3";
  accordionLeftText.textContent = "Компоненты";

  accordionLeft.append(accordionLeftImg, accordionLeftText);

  // Header right side: text + switcher, img
  const accordionRight = document.createElement("div");

  const accordionRightImg = document.createElement("img");
  accordionRightImg.className += "mr-3 transition";
  accordionRightImg.src = "./img/accordion/open-arrow.svg";
  accordionRightImg.alt = "Открыть аккордеон";

  accordionRight.appendChild(accordionRightImg);

  accordionHeader.append(accordionLeft, accordionRight);
  accordion.appendChild(accordionHeader);

  // Detail box
  const detailBox = document.createElement("div");
  detailBox.className = "detail-box";

  // Inner box
  const innerBox = document.createElement("div");
  innerBox.className = "inner-box";

  // Transition box
  const transitionBox = document.createElement("div");
  transitionBox.className = "transition-box";

  // Accordion content
  const accordionContent = document.createElement("div");
  accordionContent.className = "transition content";

  // Show content on accodion click
  accordionHeader.addEventListener("click", function () {
    detailBox.classList.toggle("active");
    accordionRightImg.classList.toggle("rotate-180");
    accordionHeader.classList.toggle("border-bottom-only");
  });

  // Создаем контейнер для таблицы
  const tableContainer = document.createElement("div");
  tableContainer.className = "table-container"; // Добавляем класс для стилизации
  tableContainer.style.marginTop = "0px";

  // Создаем таблицу внутри контента с классами Bootstrap
  const table = document.createElement("table");
  table.className = "m9-table";
  table.id = "collapsibleTable";
  tableContainer.appendChild(table); // Добавляем таблицу в контейнер

  // Применяем стили для горизонтальной прокрутки
  tableContainer.style.overflowX = "auto"; // Позволяет прокручивать содержимое по горизонтали
  tableContainer.style.whiteSpace = "nowrap"; // Запрещает перенос строк, чтобы содержимое прокручивалось горизонтально

  // Добавляем контейнер с таблицей в accordion
  accordionContent.appendChild(tableContainer);

  // Создаем заголовок таблицы
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headers = [
    "INCI",
    "Химическое название",
    "Поставщик",
    "Название по накладной",
  ];

  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    th.classList.add("th");
    // th.style.minWidth = "300px"; // Устанавливаем минимальную ширину для ячеек заголовка
    headerRow.appendChild(th);
  });

  if (currentPage === "LTK") {
    // Добавляем заголовок для столбца удаления
    const deleteTh = document.createElement("th");
    deleteTh.textContent = "";
    deleteTh.style.width = "40px"; // Устанавливаем ширину столбца удаления
    headerRow.appendChild(deleteTh);
  }

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Создаем тело таблицы
  const tbody = document.createElement("tbody");
  table.appendChild(tbody);

  // Добавляем условие для проверки существования dataversion.header
  if (dataversion && dataversion.header) {
    addTableRow(tbody, data, dataversion);
  }

  // Создаем кнопку для добавления новых строк
  const addButtonComponent = document.createElement("button");
  addButtonComponent.classList.add("m9-add-component", "block-ptk");
  addButtonComponent.textContent = "+ Добавить компонент";

  if (currentPage === "PTK") {
    addButtonComponent.display = "none";
  }

  // Удаляем все предыдущие обработчики событий 'click', если они существуют
  addButtonComponent.removeEventListener("click", addButtonComponent.onclick);

  // Добавляем обработчик события для добавления одной новой строки
  addButtonComponent.onclick = function () {
    createEmptyComponentRow(tbody, data, dataversion);
    const selectedValues = collectSelectedValuesFromTable();
    console.log(selectedValues);
  };

  accordionContent.appendChild(addButtonComponent);
  transitionBox.appendChild(accordionContent);
  innerBox.appendChild(transitionBox);
  detailBox.appendChild(innerBox);
  accordion.appendChild(detailBox);

  // Возвращаем созданный контейнер
  return accordion;
}

// Фаза 2. Выходной контроль
function createOutputControlCollapsibleContainer(
  _data = null,
  dataversion = null
) {
  const accordion = document.createElement("div");
  accordion.className += "accordion border-radius box-shadow";

  // Accordion header
  const accordionHeader = document.createElement("div");
  accordionHeader.className +=
    "accordion-header d-flex justify-content-between align-items-center py-3 cursor-pointer";

  // Header left side: img, text
  const accordionLeft = document.createElement("div");
  accordionLeft.className += "d-flex align-items-center";

  const accordionLeftImg = document.createElement("img");
  accordionLeftImg.className = "ml-3";
  accordionLeftImg.src = "./img/accordion/compass.svg";
  accordionLeftImg.alt = "Выходной контроль";

  const accordionLeftText = document.createElement("p");
  accordionLeftText.className += "h4 m-0 ml-3";
  accordionLeftText.textContent = "Выходной контроль";

  accordionLeft.append(accordionLeftImg, accordionLeftText);

  // Header right side: text + switcher, img
  const accordionRight = document.createElement("div");

  const accordionRightImg = document.createElement("img");
  accordionRightImg.className += "mr-3 transition";
  accordionRightImg.src = "./img/accordion/open-arrow.svg";
  accordionRightImg.alt = "Открыть аккордеон";

  accordionRight.appendChild(accordionRightImg);

  accordionHeader.append(accordionLeft, accordionRight);
  accordion.appendChild(accordionHeader);

  // Detail box
  const detailBox = document.createElement("div");
  detailBox.className = "detail-box";

  // Inner box
  const innerBox = document.createElement("div");
  innerBox.className = "inner-box";

  // Transition box
  const transitionBox = document.createElement("div");
  transitionBox.className = "transition-box";
  transitionBox.style.paddingTop = "0";

  // Accordion content
  const accordionContent = document.createElement("div");
  accordionContent.className = "transition content";

  // Show content on accodion click
  accordionHeader.addEventListener("click", function () {
    detailBox.classList.toggle("active");
    accordionRightImg.classList.toggle("rotate-180");
    accordionHeader.classList.toggle("border-bottom-only");
  });

  // Создаем таблицу внутри контента с классами Bootstrap
  const table = document.createElement("table");
  table.className = "m9-table";
  table.style.tableLayout = "fixed";
  table.style.width = "100%";
  table.style.marginTop = "20px";
  table.style.marginBottom = "32px";
  table.style.overflow = "auto";

  const tableContainer = document.createElement("div");
  tableContainer.classList.add("table-container");
  tableContainer.style.marginTop = "0px";
  tableContainer.style.overflowX = "auto";
  tableContainer.style.whiteSpace = "nowrap";

  tableContainer.appendChild(table);
  accordionContent.appendChild(tableContainer);
  transitionBox.appendChild(accordionContent);
  innerBox.appendChild(transitionBox);
  detailBox.appendChild(innerBox);
  accordion.appendChild(detailBox);

  // Создаем заголовок таблицы
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  // Добавляем столбцы
  const columnHeader1 = document.createElement("th");
  columnHeader1.textContent = "Параметры";
  headerRow.appendChild(columnHeader1);

  const columnHeader2 = document.createElement("th");
  columnHeader2.textContent = "Норма";
  headerRow.appendChild(columnHeader2);

  // Добавляем новый столбец для чекбоксов
  // const columnHeader3 = document.createElement("th");
  // columnHeader3.textContent = "Отметка";
  // columnHeader3.style.width = "110px"; // Устанавливаем ширину столбца
  // headerRow.appendChild(columnHeader3);

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Создаем тело таблицы
  const tbody = document.createElement("tbody");

  // Добавляем строки и формы для каждого параметра
  const parameters = [
    "Водородный показатель рН",
    "Аромат",
    "Консистенция",
    "Цвет",
    "Вязкость",
    "Плотность",
    "SPR (длина волны), нм",
  ];
  const ids = [
    "ph",
    "aroma",
    "consistency",
    "color",
    "viscosity",
    "density",
    "spr",
  ];
  for (let i = 0; i < parameters.length; i++) {
    const row = document.createElement("tr");
    const paramNameCell = document.createElement("td");
    paramNameCell.textContent = parameters[i];
    row.appendChild(paramNameCell);

    const normInputCell = document.createElement("td");
    const normInput = document.createElement("input");
    normInput.classList.add("form-control", "m9-input");
    normInput.id = ids[i];
    let inputValue = "";
    if (dataversion && dataversion.info && dataversion.info[ids[i]]) {
      inputValue = dataversion.info[ids[i]];
    }
    normInput.value = inputValue;
    normInputCell.appendChild(normInput);
    row.appendChild(normInputCell);

    // Добавляем ячейку для чекбокса
    // const checkboxCell = document.createElement("td");
    // checkboxCell.style.textAlign = "center"; // Центрируем чекбоксы
    // checkboxCell.style.width = "110px"; // Устанавливаем ширину ячейки
    // const checkbox = document.createElement("input");
    // checkbox.type = "checkbox";
    // checkbox.addEventListener("change", function () {
    //   if (this.checked) {
    //     normInput.value = "-";
    //     normInput.disabled = true;
    //   } else {
    //     normInput.value = "";
    //     normInput.disabled = false;
    //   }
    // });

    // if (inputValue === "-") {
    //   checkbox.checked = true;
    //   normInput.disabled = true;
    // }

    // checkboxCell.appendChild(checkbox);
    // row.appendChild(checkboxCell);

    tbody.appendChild(row);
  }

  table.appendChild(tbody);

  return accordion;
}

function createFormRow(labelText) {
  const formGroup = document.createElement("div");
  formGroup.classList.add("form-group");

  const label = document.createElement("label");
  label.textContent = labelText;
  formGroup.appendChild(label);

  const input = document.createElement("input");
  input.classList.add("form-control", "m9-input");
  input.type = "text";
  formGroup.appendChild(input);

  return formGroup;
}

// Фаза 3. Испытания
function createCollapsibleContainerTests(_data = null, dataversion = null) {
  const accordion = document.createElement("div");
  accordion.className += "accordion border-radius box-shadow";
  accordion.id = "CollapsibleContentTest";

  // Accordion header
  const accordionHeader = document.createElement("div");
  accordionHeader.className +=
    "accordion-header d-flex justify-content-between align-items-center py-3 cursor-pointer";

  // Header left side: img, text
  const accordionLeft = document.createElement("div");
  accordionLeft.className += "d-flex align-items-center";

  const accordionLeftImg = document.createElement("img");
  accordionLeftImg.className = "ml-3";
  accordionLeftImg.src = "./img/accordion/star.svg";
  accordionLeftImg.alt = "Испытания";

  const accordionLeftText = document.createElement("p");
  accordionLeftText.className += "h4 m-0 ml-3";
  accordionLeftText.textContent = "Испытания";

  accordionLeft.append(accordionLeftImg, accordionLeftText);

  // Header right side: text + switcher, img
  const accordionRight = document.createElement("div");

  const accordionRightImg = document.createElement("img");
  accordionRightImg.className += "mr-3 transition";
  accordionRightImg.src = "./img/accordion/open-arrow.svg";
  accordionRightImg.alt = "Открыть аккордеон";

  accordionRight.appendChild(accordionRightImg);

  accordionHeader.append(accordionLeft, accordionRight);
  accordion.appendChild(accordionHeader);

  // Detail box
  const detailBox = document.createElement("div");
  detailBox.className = "detail-box";

  // Inner box
  const innerBox = document.createElement("div");
  innerBox.className = "inner-box";

  // Transition box
  const transitionBox = document.createElement("div");
  transitionBox.className = "transition-box";
  transitionBox.style.paddingTop = "0";

  // Accordion content
  const accordionContent = document.createElement("div");
  accordionContent.className = "transition content";

  // Show content on accodion click
  accordionHeader.addEventListener("click", function () {
    detailBox.classList.toggle("active");
    accordionRightImg.classList.toggle("rotate-180");
    accordionHeader.classList.toggle("border-bottom-only");
  });

  // Создаем контент для сворачиваемого контейнера с классами Bootstrap
  const collapsibleContentTests = document.createElement("div");
  collapsibleContentTests.classList.add("collapse", "card-body");
  collapsibleContentTests.style.maxWidth = "100vw"; // Задаем максимальную ширину, равную ширине окна просмотра
  accordionContent.appendChild(collapsibleContentTests);

  // Создаем таблицу внутри контента с классами Bootstrap
  const table = document.createElement("table");
  table.className = "m9-table";
  table.id = "outputControlCollapsibleTable";
  table.style.tableLayout = "fixed"; // Фиксируем ширину столбцов
  table.style.width = "100%"; // Устанавливаем ширину таблицы равной 100%
  table.style.marginTop = "20px";
  accordionContent.appendChild(table);

  // Создаем thead для таблицы
  const thead = document.createElement("thead");
  table.appendChild(thead);

  // Создаем заголовки для thead
  const headRow = document.createElement("tr");
  thead.appendChild(headRow);

  const headColumns = [
    "Показатели",
    "Нормативы",
    "На начало испытаний",
    "Ускоренное старение",
    "Температурное испытание",
    "Нормальные условия",
  ];
  headColumns.forEach((columnText) => {
    const th = document.createElement("th");
    th.textContent = columnText;
    headRow.appendChild(th);
  });

  // Создаем tbody для таблицы
  const tbody = document.createElement("tbody");
  table.appendChild(tbody);

  // Создаем строки и ячейки для tbody
  const rowLabels = [
    ["pH", "ph_tests"],
    ["Концентрация НЧ (ppm)", "concentration"],
    ["Пик плазмонного резонанса (нм)", "plasmon_resonance_peak"],
    ["Цветность", "chroma"],
    ["Вязкость", "birefringence"],
    ["Коллоидная стабильность", "colloidal_stability"],
    ["Отдушка", "aroma"],
  ];
  rowLabels.forEach(([labelText, prefix]) => {
    const row = document.createElement("tr");
    tbody.appendChild(row);

    const labelCell = document.createElement("td");
    labelCell.textContent = labelText;
    row.appendChild(labelCell);

    const ids = [
      "standards",
      "start_test_standards",
      "accelerated_aging",
      "temperature_test",
      "normal_conditions",
    ];
    ids.forEach((idSuffix) => {
      const inputCell = document.createElement("td");
      const textarea = document.createElement("textarea"); // Изменено на textarea
      textarea.classList.add("form-control", "m9-input");
      textarea.id = `${prefix}_${idSuffix}`;
      // Присваиваем значение из dataversion.test
      textarea.value = dataversion.test[`${prefix}_${idSuffix}`];
      inputCell.appendChild(textarea); // Изменено на textarea
      row.appendChild(inputCell);
    });
  });

  // Создаем формы для температуры, версии рецептуры и даты испытаний
  const formsRow = document.createElement("div");
  formsRow.classList.add("row");
  formsRow.style.marginTop = "64px";

  const tempTestingInput = createFormInput(
    "t на начало испытаний",
    "temp_testing",
    dataversion.test.temp_testing
  );
  const recipeVersionInput = createFormInput(
    "Версия рецептуры",
    "recipe_version",
    dataversion.version
  );
  const testStartEndInput = createFormInput(
    "Дата испытания начало\\конец",
    "test_start_end",
    dataversion.test.test_start_end
  );

  formsRow.appendChild(tempTestingInput);
  formsRow.appendChild(recipeVersionInput);
  formsRow.appendChild(testStartEndInput);

  accordionContent.appendChild(formsRow);

  // Создаем большое текстовое поле для примечаний
  const notesTextarea = document.createElement("textarea");
  notesTextarea.classList.add("form-control", "mt-3", "m9-input");
  notesTextarea.id = "notes";
  notesTextarea.setAttribute("rows", "5");
  notesTextarea.setAttribute("placeholder", "Примечания");
  // Присваиваем значение из dataversion.test
  notesTextarea.value = dataversion.test.notes;
  accordionContent.appendChild(notesTextarea);

  // Создаем контейнер для таблицы
  const tableContainer = document.createElement("div");
  tableContainer.classList.add("table-container");
  accordionContent.appendChild(tableContainer);

  // Создаем таблицу
  const tableimage = document.createElement("table");
  tableimage.style.width = "100%"; // Устанавливаем ширину таблицы равной ширине родительского контейнера
  // Добавляем обработчик клика на ячейку таблицы
  tableimage.addEventListener("click", function (event) {
    const target = event.target;
    if (target.classList.contains("delete-button-image")) {
      // Если нажата кнопка удаления, вызываем функцию удаления изображения
      handleImageDelete(target);
    } else if (target.classList.contains("button-image")) {
      // Если нажата кнопка добавления изображения, вызываем функцию загрузки изображения
      const input = target.parentElement.querySelector(".image-upload-input");
      input.click();
    }
  });
  tableContainer.appendChild(tableimage);

  // Создаем строки и ячейки для таблицы
  for (let i = 0; i < 3; i++) {
    const row = document.createElement("tr");
    tableimage.appendChild(row);

    for (let j = 0; j < 2; j++) {
      const cell = document.createElement("td");
      row.appendChild(cell);

      // Создаем div-контейнер для кнопки с изображением
      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("button-container");
      cell.appendChild(buttonContainer);

      // Создаем кнопку с изображением
      const button = document.createElement("button");
      button.classList.add("image-button");
      buttonContainer.appendChild(button);

      // Создаем элемент img для отображения изображения кнопки
      const imageElement = document.createElement("img");
      imageElement.classList.add("button-image");
      imageElement.src = "./icons/icons8-add-image-96.png";
      button.appendChild(imageElement);

      // Создаем элемент input для загрузки изображений, который будет скрыт
      const imageInput = document.createElement("input");
      imageInput.setAttribute("type", "file");
      imageInput.setAttribute("accept", "image/*");
      imageInput.classList.add("image-upload-input");
      imageInput.style.display = "none"; // Скрываем input
      imageInput.addEventListener("change", handleImageUpload);
      buttonContainer.appendChild(imageInput);

      // Добавляем обработчик клика на кнопку для открытия диалога выбора файла
      button.addEventListener("click", function () {
        imageInput.click();
      });

      // Создаем кнопку для удаления изображения
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button");
      deleteButton.style.display = "none"; // Скрываем кнопку удаления
      cell.appendChild(deleteButton);

      // Создаем элемент img для отображения изображения кнопки удаления
      const deleteImage = document.createElement("img");
      deleteImage.classList.add("delete-button-image");
      deleteImage.src = "./img/trash.svg";
      deleteImage.style.width = "30px";
      deleteImage.style.height = "30px";
      deleteButton.appendChild(deleteImage);
    }
  }

  function handleImageUpload(event) {
    const files = event.target.files;
    for (const file of files) {
      // Создаем элемент img
      const imageElement = document.createElement("img");
      imageElement.classList.add("uploaded-image");
      imageElement.style.width = "100%"; // Устанавливаем ширину изображения равной ширине td
      imageElement.style.height = "auto"; // Автоматически подстраиваем высоту

      // Читаем содержимое файла в формате Data URL
      const reader = new FileReader();
      reader.onload = function (e) {
        imageElement.src = e.target.result; // Устанавливаем src изображения
        // Добавляем изображение в контейнер
        const parentContainer = event.target.parentElement.parentElement;
        parentContainer.appendChild(imageElement);
        // Скрываем кнопку добавления и показываем кнопку удаления
        parentContainer.querySelector(".button-container").style.display =
          "none";
        parentContainer.querySelector(".delete-button").style.display = "block";

        // Отправляем изображение на сервер для сохранения
        uploadImageToServer(file).then((imageUrl) => {
          // Сохраняем URL изображения в базе данных
          saveImageUrlToDatabase(imageUrl).then(() => {
            // Обновляем интерфейс пользователя
            updateUserInterface(imageUrl);
          });
        });
      };
      reader.readAsDataURL(file);
    }
  }

  // Функция обработки удаления изображения
  function handleImageDelete(target) {
    const parentContainer = target.closest("td");
    const uploadedImage = parentContainer.querySelector(".uploaded-image");
    if (uploadedImage) {
      uploadedImage.remove();
      // Показываем кнопку добавления и скрываем кнопку удаления
      parentContainer.querySelector(".button-container").style.display =
        "block";
      parentContainer.querySelector(".delete-button").style.display = "none";
    }
  }

  function uploadImageToServer(file) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", file);

      fetch("https://" + domain + "/9x/tech-map/image-upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            resolve(data.imageUrl);
          } else {
            reject(data.error);
          }
        })
        .catch((error) => reject(error));
    });
  }

  transitionBox.appendChild(accordionContent);
  innerBox.appendChild(transitionBox);
  detailBox.appendChild(innerBox);
  accordion.appendChild(detailBox);

  return accordion;
}

// Функция для создания поля ввода с уникальным id, меткой и значением
function createFormInput(labelText, id, value) {
  const colDiv = document.createElement("div");
  colDiv.classList.add("col");

  const formGroup = document.createElement("div");
  formGroup.classList.add("form-group");

  const label = document.createElement("label");
  label.textContent = labelText;
  formGroup.appendChild(label);

  const input = document.createElement("input");
  input.classList.add("form-control", "m9-input");

  input.id = id; // Устанавливаем уникальный id
  input.value = value; // Устанавливаем значение
  formGroup.appendChild(input);

  colDiv.appendChild(formGroup);

  return colDiv;
}

//--------------------------------------------------------------------------------------------------------------

// Глобальная переменная для хранения текущего обработчика событий
let currentAddButtonHandler = null;

function getPhaseNameList(_dataversion) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const phaseNameList = alphabet.split("").map((letter) => `/F/${letter}`);
  return phaseNameList;
}

function disabledOption(selectElement) {
  const allSelect = document.querySelectorAll(".num-phase-select");
  allSelect.forEach((select) => {
    const selectOptions = select.querySelectorAll("option");
    selectOptions.forEach((option) => {
      if (
        option.value === selectElement.value &&
        option.parentElement !== selectElement
      ) {
        option.disabled = true;
      }
    });
  });
}

function populatePhaseSelect(selectElement, selectedPhases, currentPhaseNum) {
  // Очищаем текущие опции
  selectElement.innerHTML = "";

  // Заполняем select новыми опциями
  for (let i = 1; i <= 8; i++) {
    for (let j = 1; j <= 8; j++) {
      const optionValue = `${i}.${j}`;
      const isOptionSelected = selectedPhases.includes(optionValue);
      if (!isOptionSelected || optionValue === currentPhaseNum) {
        const option = document.createElement("option");
        option.value = optionValue;
        option.text = optionValue;
        if (optionValue === currentPhaseNum) {
          option.selected = true;
        }
        selectElement.appendChild(option);
      }
    }
  }

  // Обработчик событий для обновления selectedPhases и сортировки блоков фаз
  selectElement.addEventListener("change", function (e) {
    const selectElements = document.querySelectorAll(".num-phase-select");
    selectElements.forEach((select) => {
      const selectOptions = select.querySelectorAll("option");
      selectOptions.forEach((option) => {
        option.disabled = false;
      });
    });
    disabledOption(this);
    const previousValue = this.oldValue;
    const newValue = e.target.value;

    // Обновляем selectedPhases, удаляя старое значение и добавляя новое
    const oldValueIndex = selectedPhases.indexOf(previousValue);
    if (oldValueIndex !== -1) {
      selectedPhases.splice(oldValueIndex, 1);
    }
    selectedPhases.push(newValue);

    // Сохраняем новое значение как старое для будущих изменений
    this.oldValue = newValue;
  });
}

let phaseCounter = 0;

// Фаза 4. Фазы
const createPhaseInterface = (
  phaseData = null,
  selectsData = null,
  dataversion = null,
  selectedPhases = [],
  data
) => {
  // Внешняя переменная для отслеживания количества новых фаз
  dataversion.phases;
  phaseCounter++;
  const container = document.createElement("div");
  container.className = "card phase";
  container.style.padding = "0px";
  container.style.backgroundColor = "#fff";
  if (phaseData && phaseData.ID) {
    container.id = phaseData.ID; // Устанавливаем существующий ID фазы
  }

  const containerHeader = document.createElement("div");
  containerHeader.className = "m9-container";
  containerHeader.style.display = "flex";
  containerHeader.style.alignItems = "center";
  containerHeader.style.justifyContent = "flex-start";
  containerHeader.style.flexFlow = "row wrap";
  containerHeader.style.gap = "20px";

  // Кнопка для сворачивания/разворачивания
  const collapseButton = document.createElement("button");
  collapseButton.className = "m9-btn-custom";
  collapseButton.id = "leftElementId";
  collapseButton.innerHTML = "&#9660;"; // Стрелочка вниз в HTML
  collapseButton.setAttribute("data-toggle", "collapse");
  collapseButton.setAttribute("data-target", `#collapseContent${phaseCounter}`);
  containerHeader.appendChild(collapseButton);

  // Создание списка для выбора названия фазы
  const phaseNameSelect = document.createElement("select");
  phaseNameSelect.className = "m9-input name-select";
  phaseNameSelect.style.width = "85px";
  phaseNameSelect.style.marginLeft = "10px";
  const emptyOption = document.createElement("option"); // Добавляем пустую опцию
  emptyOption.value = "";
  emptyOption.text = "";
  phaseNameSelect.appendChild(emptyOption);
  const phaseNameList = getPhaseNameList(dataversion);
  phaseNameList.forEach((phaseNameOption) => {
    const option = document.createElement("option");
    option.value = phaseNameOption;
    option.text = phaseNameOption;
    phaseNameSelect.appendChild(option);
  });
  if (phaseData && phaseData.name) {
    phaseNameSelect.value = phaseData.name;
  } else {
    emptyOption.selected = true;
  }
  containerHeader.appendChild(phaseNameSelect);

  // Создание списка для выбора номера фазы
  const numberPhaseSelect = document.createElement("select");
  numberPhaseSelect.className = "m9-select num_phase num-phase-select";
  numberPhaseSelect.style.marginLeft = "10px";
  if (phaseData) {
    numberPhaseSelect.value = phaseData.num_phase;
    numberPhaseSelect.oldValue = phaseData.num_phase; // Сохраняем текущее значение для последующего использования
  }
  const selectElements = document.querySelectorAll(".num-phase-select");
  selectElements.forEach((select) => {
    disabledOption(select);
  });
  populatePhaseSelect(
    numberPhaseSelect,
    selectedPhases,
    phaseData ? phaseData.num_phase : ""
  );
  containerHeader.appendChild(numberPhaseSelect);

  // Создаем кнопку для копирования таблицы компонентов в фазе
  const copyTable = document.createElement("img");
  copyTable.className = "m9-navigation-menu-icon"; // Добавляем класс к иконке
  copyTable.alt = "Копировать таблицу";
  copyTable.src = "./img/copy.svg";
  copyTable.onclick = function () {
    // Находим таблицу внутри контейнера с классом 'card phase'
    const table = this.closest(".card.phase").querySelector("table");
    if (table) {
      // Вызываем функцию копирования для найденной таблицы
      copyTableToClipboard(table);
    }
  };
  containerHeader.appendChild(copyTable);

  // Создаем кнопку для копирования таблицы компонентов в фазе
  const removePhaseButton = document.createElement("img");
  removePhaseButton.className = "m9-navigation-menu-icon"; // Добавляем класс к иконке
  removePhaseButton.alt = "Удалить фазу";
  removePhaseButton.src = "./img/trash.svg";
  removePhaseButton.onclick = function () {
    // Проверяем, существует ли ID фазы
    if (phaseData && phaseData.ID) {
      let param = phaseData.ID;
      console.log(param);
      let urlupdate = `https://${domain}/9x/app/php/delete-phase.php?${urlParams}&phase_id=${param}`;
      console.log(urlupdate);
      saveDelete(urlupdate); // Вызываем функцию saveDelete с ID компонента
      container.remove();
    } else {
      container.remove(); // Просто удаляем контейнер, если ID нет
    }
  };
  containerHeader.appendChild(removePhaseButton);

  container.appendChild(containerHeader);

  // Создаем контейнер для сворачиваемого контента
  const collapseContent = document.createElement("div");
  collapseContent.className = "collapse";
  collapseContent.id = `collapseContent${phaseCounter}`;

  console.log(phaseData);

  // Установка componentData в null, если phaseData не предоставлено
  let componentData = phaseData ? phaseData.components : null;

  let phaseDataBlock = createPhaseDataBlock(
    phaseData,
    selectsData,
    componentData
  ); // добавляем блок с данными фазы
  collapseContent.appendChild(phaseDataBlock);

  let componentsTable = createComponentsTable(
    phaseData,
    selectsData,
    componentData,
    data
  ); // добавляем таблицу компонентов
  collapseContent.appendChild(componentsTable);

  if (phaseData.name !== "/F/A") {
    let mixingModeBlock = createMixingModeBlock(
      phaseData,
      selectsData,
      componentData,
      dataversion
    ); // добавляем блок смешивания
    collapseContent.appendChild(mixingModeBlock);
  } else if (!phaseData.name) {
    let mixingModeBlock = createMixingModeBlock(
      phaseData,
      selectsData,
      componentData,
      dataversion
    ); // добавляем блок смешивания
    collapseContent.appendChild(mixingModeBlock);
  }

  container.appendChild(collapseContent);

  return container;
};

function collectSelectedValuesFromTable() {
  const table = document.getElementById("collapsibleTable"); // Используем id для выбора таблицы
  if (!table) {
    console.error("Таблица с id=collapsibleTable не найдена");
    return [];
  }

  const rows = table.querySelectorAll("tbody tr"); // Выбираем только строки в теле таблицы
  const selectedValues = [];

  rows.forEach((row) => {
    // Предполагаем, что элементы находятся в 4-м столбце, измените индекс, если это не так
    const cell = row.cells[3]; // Получаем ячейку, где ожидаются элементы

    // Проверяем наличие select
    const select = cell.querySelector("select");
    if (select && select.value) {
      // Проверяем, что select существует и имеет значение
      selectedValues.push(select.value);
    }

    // Проверяем наличие input
    const input = cell.querySelector("input");
    if (input && input.textContent.trim()) {
      // Проверяем, что input существует и его текстовое содержимое не пустое
      selectedValues.push(input.textContent.trim());
    }
  });

  return selectedValues;
}

function checkAllInputs() {
  // document.querySelector('#assembleButton').disabled = !allFilled;
}

// todo восстановить
// Функция для скрытия элементов с заданным классом
function hideElementsByClass() {
  // phasesContainer.querySelectorAll(className).forEach((element) => {
  //   const label = element.previousElementSibling;
  //   label.style.display = "none";
  //   element.style.display = "none";
  // });
}

// Function to remove an element and its previous sibling
function removeElementAndLabel(element) {
  const label = element.previousElementSibling;
  label.remove();
  element.remove();
}

async function notApproveFunction(commentary) {
  let url = `https://${domain}/9x/app/php/not-approve-prod-tech-map.php?${urlParams}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentary),
    });
    const responseData = await response.json();
    console.log(responseData);

    if (response.ok) {
      alert("Запрос выполнен");
      location.reload();
    } else {
      alert("Ошибка");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Ошибка");
  }
}

function createNavigationMenu(data) {
  // Создаем контейнер для меню
  const menuContainer = document.createElement("div");
  menuContainer.className = "m9-navigation-menu"; // Используем общий класс контейнера

  // Создаем контейнер для логотипа
  const logoContainer = document.createElement("div");
  logoContainer.className = "logo-container"; // Добавляем класс для стилизации

  // Создаем элемент для логотипа
  const logo = document.createElement("img");
  // logo.src = 'https://thumb.tildacdn.com/tild3864-3062-4334-b362-376330313432/-/resize/60x/-/format/webp/13logo.png'; // Малый логотип
  logo.src =
    "https://static.tildacdn.com/tild3036-6565-4337-b762-306430326230/2c671ea40d8a4ffb8829.png"; // Большой логотип
  logo.alt = "Логотип";
  logo.style.width = "140px";
  logoContainer.appendChild(logo);

  // Добавляем контейнер логотипа в основной контейнер навигационного меню
  menuContainer.appendChild(logoContainer);

  // Создаем контейнер для логотипа
  const headerNameContainer = document.createElement("div");
  headerNameContainer.className = "logo-container"; // Добавляем класс для стилизации
  headerNameContainer.id = "headerNameContainer";

  // Добавляем контейнер логотипа в основной контейнер навигационного меню
  menuContainer.appendChild(headerNameContainer);

  // Создаем контейнер для кнопок меню
  const menuItemsContainer = document.createElement("div");
  menuItemsContainer.className = "menu-items-container"; // Добавляем класс для стилизации

  const Checkbox = document.createElement("input");
  Checkbox.type = "checkbox"; // Устанавливаем тип чекбокса
  Checkbox.id = "Checkbox"; // Добавляем идентификатор для удобства работы с чекбоксом
  Checkbox.style.cursor = "pointer";
  Checkbox.checked = data.data.isSimplified;
  Checkbox.onclick = function () {
    let urlupdate = `https://${domain}/9x/app/php/setSimplifiedAcceptance.php?${urlParams}`;
    saveDelete(urlupdate);
  };

  menuItemsContainer.appendChild(Checkbox);

  // Создаем кнопку для обращения в поддержку
  const supportButton = document.createElement("span");
  supportButton.className = "m9-navigation-menu-icon cursor-pointer"; // Добавляем класс к иконке
  supportButton.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24">
<path d="m22.5,9h-.5v-1c0-2.757-2.243-5-5-5h-4V1c0-.552-.447-1-1-1s-1,.448-1,1v2h-4c-2.757,0-5,2.243-5,5v1h-.5c-.827,0-1.5.673-1.5,1.5v3c0,.827.673,1.5,1.5,1.5h.5v1c0,2.757,2.243,5,5,5h7.697l3.963,2.642c.36.24.775.361,1.191.361.348,0,.696-.084,1.015-.255.699-.375,1.134-1.1,1.134-1.894v-6.855h.5c.827,0,1.5-.673,1.5-1.5v-3c0-.827-.673-1.5-1.5-1.5Zm-2.5,12.855c0,.022,0,.089-.078.13-.08.043-.136.004-.152-.007l-4.215-2.81c-.164-.109-.357-.168-.555-.168H7c-1.654,0-3-1.346-3-3v-8c0-1.654,1.346-3,3-3h10c1.654,0,3,1.346,3,3v13.855ZM7,9.5c0-.828.672-1.5,1.5-1.5s1.5.672,1.5,1.5-.672,1.5-1.5,1.5-1.5-.672-1.5-1.5Zm10,0c0,.828-.672,1.5-1.5,1.5s-1.5-.672-1.5-1.5.672-1.5,1.5-1.5,1.5.672,1.5,1.5Zm-.153,4.695c.294.468.152,1.085-.315,1.378-1.037.651-2.666,1.427-4.531,1.427s-3.494-.776-4.531-1.427c-.468-.293-.609-.911-.315-1.378.294-.467.911-.609,1.378-.316.815.512,2.079,1.121,3.469,1.121s2.653-.609,3.469-1.121c.466-.294,1.085-.152,1.378.316Z"/>
</svg>
`;
  supportButton.onclick = function () {};
  menuItemsContainer.appendChild(supportButton);

  // Создаем кнопку для перехода на рецептуру
  const openNewTab = document.createElement("span");
  openNewTab.className = "m9-navigation-menu-icon cursor-pointer";
  openNewTab.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="30" height="30"><path d="M19,1H5C2.24,1,0,3.24,0,6v12c0,2.76,2.24,5,5,5h14c2.76,0,5-2.24,5-5V6c0-2.76-2.24-5-5-5ZM5,3h14c1.65,0,3,1.35,3,3v2H2v-2c0-1.65,1.35-3,3-3Zm14,18H5c-1.65,0-3-1.35-3-3V10H22v8c0,1.65-1.35,3-3,3Zm-1-15.5c0-.83,.67-1.5,1.5-1.5s1.5,.67,1.5,1.5-.67,1.5-1.5,1.5-1.5-.67-1.5-1.5Zm-4,0c0-.83,.67-1.5,1.5-1.5s1.5,.67,1.5,1.5-.67,1.5-1.5,1.5-1.5-.67-1.5-1.5Zm-4,0c0-.83,.67-1.5,1.5-1.5s1.5,.67,1.5,1.5-.67,1.5-1.5,1.5-1.5-.67-1.5-1.5Z"/></svg>
`;
  openNewTab.title = "Открыть рецептуру в новом окне";
  openNewTab.onclick = function () {
    let recipeId = data.data.recipeId;
    window.open(`https://app.salesap.ru/products/${recipeId}`, "_blank"); // Открываем ссылку в новом окне
  };
  menuItemsContainer.appendChild(openNewTab);

  // Создаем кнопку для обновления страницы
  const refreshPageIcon = document.createElement("span");
  refreshPageIcon.style.height = "30px";
  refreshPageIcon.style.width = "30px";
  refreshPageIcon.className = "m9-navigation-menu-icon cursor-pointer";
  refreshPageIcon.title = "Обновить страницу";
  refreshPageIcon.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24">
<path d="m19,0H5C2.243,0,0,2.243,0,5v14c0,2.757,2.243,5,5,5h14c2.757,0,5-2.243,5-5V5c0-2.757-2.243-5-5-5Zm3,19c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V5c0-1.654,1.346-3,3-3h14c1.654,0,3,1.346,3,3v14Zm-3-13v3c0,1.103-.897,2-2,2h-3c-.553,0-1-.448-1-1s.447-1,1-1h1.984c-.934-1.235-2.399-2-3.984-2-2.116,0-4.011,1.339-4.715,3.333-.146.411-.531.667-.943.667-.11,0-.223-.019-.333-.058-.521-.184-.794-.755-.61-1.276.986-2.792,3.64-4.667,6.602-4.667,1.913,0,3.702.801,5,2.127v-1.127c0-.552.447-1,1-1s1,.448,1,1Zm-.398,8.333c-.986,2.792-3.64,4.667-6.602,4.667-1.913,0-3.702-.801-5-2.127v1.127c0,.552-.447,1-1,1s-1-.448-1-1v-3c0-1.103.897-2,2-2h3c.553,0,1,.448,1,1s-.447,1-1,1h-1.984c.934,1.235,2.399,2,3.984,2,2.116,0,4.011-1.339,4.715-3.333.185-.521.755-.794,1.276-.61.521.184.794.755.61,1.276Z"/>
</svg>
`;
  refreshPageIcon.onclick = function () {
    location.reload();
  };
  menuItemsContainer.appendChild(refreshPageIcon);

  // Создаем кнопку для открытия страницы в новом окне
  const openPageIcon = document.createElement("span");
  openPageIcon.className = "m9-navigation-menu-icon cursor-pointer"; // Добавляем класс к иконке
  openPageIcon.id = "openNewTabButton";
  openPageIcon.title = "Открыть в полном окне";
  openPageIcon.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="30" height="30"><path d="M9.707,14.293c.391,.391,.391,1.023,0,1.414l-6.293,6.293h4.586c.553,0,1,.448,1,1s-.447,1-1,1H3c-1.654,0-3-1.346-3-3v-5c0-.552,.447-1,1-1s1,.448,1,1v4.586l6.293-6.293c.391-.391,1.023-.391,1.414,0ZM21,0h-5c-.553,0-1,.448-1,1s.447,1,1,1h4.586l-6.293,6.293c-.391,.391-.391,1.023,0,1.414,.195,.195,.451,.293,.707,.293s.512-.098,.707-.293l6.293-6.293v4.586c0,.552,.447,1,1,1s1-.448,1-1V3c0-1.654-1.346-3-3-3Z"/></svg>
`;
  openPageIcon.onclick = function () {
    window.open(window.location.href, "_blank");
  };
  menuItemsContainer.appendChild(openPageIcon);

  // Создаем кнопку для дополнительной информации
  const infoButton = document.createElement("span");
  infoButton.className = "m9-navigation-menu-icon cursor-pointer"; // Добавляем класс к иконке
  infoButton.id = "recipeButton";
  infoButton.title = "Рецептура";
  infoButton.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24">
<path d="m11,23c0,.553-.448,1-1,1h-5c-2.757,0-5-2.243-5-5V5.001C0,2.244,2.242,0,4.999,0h10.001c2.757,0,5,2.242,5,4.999v2c0,.553-.448,1-1,1s-1-.447-1-1v-2c0-1.654-1.346-3-3-3H4.999c-1.654,0-3,1.347-3,3.001v13.999c0,1.654,1.346,3,3,3h5c.552,0,1,.447,1,1Zm12.553.553c-.195.195-.451.293-.707.293s-.512-.098-.707-.293l-2.666-2.666c-.981.698-2.177,1.113-3.473,1.113-3.314,0-6-2.686-6-6s2.686-6,6-6,6,2.686,6,6c0,1.296-.415,2.492-1.113,3.473l2.666,2.666c.391.391.391,1.023,0,1.414Zm-6.573-5.227l2.703-2.614c.398-.383.412-1.016.029-1.414-.382-.399-1.015-.41-1.414-.029l-2.713,2.624c-.143.142-.378.143-.522,0l-1.132-1.108c-.395-.386-1.028-.379-1.414.016-.387.395-.38,1.027.015,1.414l1.132,1.108c.459.449,1.062.674,1.664.674s1.201-.225,1.653-.671ZM7,5h-2c-.552,0-1,.447-1,1s.448,1,1,1h2c.552,0,1-.447,1-1s-.448-1-1-1Zm0,10h-2c-.552,0-1,.447-1,1s.448,1,1,1h2c.552,0,1-.447,1-1s-.448-1-1-1Zm4-10c-.552,0-1,.447-1,1s.448,1,1,1h4c.552,0,1-.447,1-1s-.448-1-1-1h-4Zm-4,5h-2c-.552,0-1,.447-1,1s.448,1,1,1h2c.552,0,1-.447,1-1s-.448-1-1-1Z"/>
</svg>
`;
  infoButton.onclick = function () {};
  menuItemsContainer.appendChild(infoButton);

  // Создаем кнопку для удаления
  const deleteButton = document.createElement("span");
  deleteButton.className = "m9-navigation-menu-icon cursor-pointer"; // Добавляем класс к иконке
  deleteButton.id = "deletLTM";
  deleteButton.title = "Удалить версию";
  deleteButton.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="30" height="30"><path d="M15.207,14.207,13.414,16l1.793,1.793a1,1,0,1,1-1.414,1.414L12,17.414l-1.793,1.793a1,1,0,0,1-1.414-1.414L10.586,16,8.793,14.207a1,1,0,0,1,1.414-1.414L12,14.586l1.793-1.793a1,1,0,0,1,1.414,1.414ZM22,10.485V19a5.006,5.006,0,0,1-5,5H7a5.006,5.006,0,0,1-5-5V5A5.006,5.006,0,0,1,7,0h4.515a6.958,6.958,0,0,1,4.95,2.05l3.484,3.486A6.951,6.951,0,0,1,22,10.485ZM15.051,3.464A5.01,5.01,0,0,0,14,2.684V7a1,1,0,0,0,1,1h4.316a4.983,4.983,0,0,0-.781-1.05ZM20,10.485c0-.165-.032-.323-.047-.485H15a3,3,0,0,1-3-3V2.047C11.838,2.032,11.679,2,11.515,2H7A3,3,0,0,0,4,5V19a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3Z"/></svg>
`;
  deleteButton.onclick = function () {};
  menuItemsContainer.appendChild(deleteButton);

  // Создаем кнопку для не утверждать
  const notApproveButton = document.createElement("span");
  notApproveButton.className = "m9-navigation-menu-icon cursor-pointer";
  notApproveButton.id = "notApproveButton";
  notApproveButton.title = "Не утверждать";
  notApproveButton.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="30" height="30"><path d="m11,14.5v-3.5c0-.552.448-1,1-1s1,.448,1,1v3.5c0,.552-.448,1-1,1s-1-.448-1-1Zm1,2.5c-.828,0-1.5.672-1.5,1.5s.672,1.5,1.5,1.5,1.5-.672,1.5-1.5-.672-1.5-1.5-1.5Zm10-6.515v8.515c0,2.757-2.243,5-5,5H7c-2.757,0-5-2.243-5-5V5C2,2.243,4.243,0,7,0h4.515c1.87,0,3.627.728,4.95,2.05l3.485,3.485c1.322,1.322,2.05,3.08,2.05,4.95Zm-6.95-7.021c-.318-.318-.671-.587-1.05-.805v4.341c0,.551.449,1,1,1h4.341c-.218-.379-.487-.733-.805-1.05l-3.485-3.485Zm4.95,7.021c0-.163-.008-.325-.023-.485h-4.977c-1.654,0-3-1.346-3-3V2.023c-.16-.015-.322-.023-.485-.023h-4.515c-1.654,0-3,1.346-3,3v14c0,1.654,1.346,3,3,3h10c1.654,0,3-1.346,3-3v-8.515Z"/></svg>
`;
  notApproveButton.onclick = function () {
    // Запрашиваем у пользователя ввод комментария
    const commentary = prompt("Пожалуйста, введите комментарий:", "");
    if (commentary !== null && commentary.trim().length > 0) {
      notApproveFunction(commentary);
    } else {
      console.log("Комментарий не был введен.");
    }
  };
  menuItemsContainer.appendChild(notApproveButton);

  // Создаем кнопку для утверждения
  const approveButton = document.createElement("span");
  approveButton.className = "m9-navigation-menu-icon cursor-pointer";
  approveButton.id = "assembleButton";
  approveButton.title = "Утвердить";
  approveButton.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" height="30" viewBox="0 0 24 24" width="30" data-name="Layer 1"><path d="m19.95 5.536-3.486-3.486a6.954 6.954 0 0 0 -4.949-2.05h-4.515a5.006 5.006 0 0 0 -5 5v14a5.006 5.006 0 0 0 5 5h10a5.006 5.006 0 0 0 5-5v-8.515a6.954 6.954 0 0 0 -2.05-4.949zm-1.414 1.414a5.018 5.018 0 0 1 .781 1.05h-4.317a1 1 0 0 1 -1-1v-4.317a5.018 5.018 0 0 1 1.05.781zm1.464 12.05a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3-3v-14a3 3 0 0 1 3-3h4.515c.165 0 .323.032.485.047v4.953a3 3 0 0 0 3 3h4.953c.015.162.047.32.047.485zm-3.276-5.689a1 1 0 0 1 -.035 1.413l-3.589 3.414a3 3 0 0 1 -4.226-.017l-1.54-1.374a1 1 0 0 1 1.332-1.494l1.585 1.414a1 1 0 0 0 1.456.04l3.6-3.431a1 1 0 0 1 1.417.035z"/></svg>
`;
  approveButton.onclick = function () {};
  menuItemsContainer.appendChild(approveButton);

  // Создаем кнопку для копирования
  const copyButton = document.createElement("span");
  copyButton.className = "m9-navigation-menu-icon cursor-pointer";
  copyButton.id = "newLtkButton";
  copyButton.title = "Копировать";
  copyButton.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" height="30" viewBox="0 0 24 24" width="30" data-name="Layer 1"><path d="m16 16a1 1 0 0 1 -1 1h-2v2a1 1 0 0 1 -2 0v-2h-2a1 1 0 0 1 0-2h2v-2a1 1 0 0 1 2 0v2h2a1 1 0 0 1 1 1zm6-5.515v8.515a5.006 5.006 0 0 1 -5 5h-10a5.006 5.006 0 0 1 -5-5v-14a5.006 5.006 0 0 1 5-5h4.515a6.958 6.958 0 0 1 4.95 2.05l3.484 3.486a6.951 6.951 0 0 1 2.051 4.949zm-6.949-7.021a5.01 5.01 0 0 0 -1.051-.78v4.316a1 1 0 0 0 1 1h4.316a4.983 4.983 0 0 0 -.781-1.05zm4.949 7.021c0-.165-.032-.323-.047-.485h-4.953a3 3 0 0 1 -3-3v-4.953c-.162-.015-.321-.047-.485-.047h-4.515a3 3 0 0 0 -3 3v14a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3z"/></svg>
`;
  copyButton.onclick = function () {};
  menuItemsContainer.appendChild(copyButton);

  // Создаем кнопку для импорта
  const importButton = document.createElement("span");
  importButton.className = "m9-navigation-menu-icon cursor-pointer";
  importButton.id = "importButton";
  importButton.title = "Импорт";
  importButton.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="30" height="30"><path d="m19.949,5.536l-3.484-3.486c-1.323-1.322-3.081-2.05-4.95-2.05h-4.515C4.243,0,2,2.243,2,5v6c0,.552.447,1,1,1s1-.448,1-1v-6c0-1.654,1.346-3,3-3h4.515c.163,0,.325.008.485.023v4.977c0,1.654,1.346,3,3,3h4.977c.015.16.023.322.023.485v8.515c0,1.654-1.346,3-3,3H7c-1.654,0-3-1.346-3-3,0-.552-.447-1-1-1s-1,.448-1,1c0,2.757,2.243,5,5,5h10c2.757,0,5-2.243,5-5v-8.515c0-1.871-.729-3.628-2.051-4.95Zm-4.949,2.464c-.552,0-1-.449-1-1V2.659c.38.218.733.487,1.051.805l3.484,3.486c.318.317.587.67.805,1.05h-4.341Zm-4.602,8H1c-.553,0-1-.448-1-1s.447-1,1-1h9.398l-1.293-1.293c-.391-.391-.391-1.024,0-1.414.391-.391,1.023-.391,1.414,0l1.613,1.614c1.154,1.154,1.154,3.032,0,4.187l-1.613,1.614c-.195.195-.451.293-.707.293s-.512-.098-.707-.293c-.391-.39-.391-1.023,0-1.414l1.293-1.293Z"/></svg>
`;
  importButton.onclick = function () {};
  menuItemsContainer.appendChild(importButton);

  // Создаем кнопку для редактирования
  const redactButton = document.createElement("span");
  redactButton.className = "m9-navigation-menu-icon cursor-pointer";
  redactButton.id = "redactButton";
  redactButton.title = "Редактировать";
  redactButton.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="30" height="30"><path d="m18.813,10c.309,0,.601-.143.79-.387s.255-.562.179-.861c-.311-1.217-.945-2.329-1.833-3.217l-3.485-3.485c-1.322-1.322-3.08-2.05-4.95-2.05h-4.515C2.243,0,0,2.243,0,5v14c0,2.757,2.243,5,5,5h3c.552,0,1-.448,1-1s-.448-1-1-1h-3c-1.654,0-3-1.346-3-3V5c0-1.654,1.346-3,3-3h4.515c.163,0,.325.008.485.023v4.977c0,1.654,1.346,3,3,3h5.813Zm-6.813-3V2.659c.379.218.732.488,1.05.806l3.485,3.485c.314.314.583.668.803,1.05h-4.338c-.551,0-1-.449-1-1Zm11.122,4.879c-1.134-1.134-3.11-1.134-4.243,0l-6.707,6.707c-.755.755-1.172,1.76-1.172,2.829v1.586c0,.552.448,1,1,1h1.586c1.069,0,2.073-.417,2.828-1.172l6.707-6.707c.567-.567.879-1.32.879-2.122s-.312-1.555-.878-2.121Zm-1.415,2.828l-6.708,6.707c-.377.378-.879.586-1.414.586h-.586v-.586c0-.534.208-1.036.586-1.414l6.708-6.707c.377-.378,1.036-.378,1.414,0,.189.188.293.439.293.707s-.104.518-.293.707Z"/></svg>
`;
  redactButton.onclick = function () {};
  menuItemsContainer.appendChild(redactButton);

  // Создаем кнопку для сохранения
  const saveButton = document.createElement("span");
  saveButton.className = "m9-navigation-menu-icon cursor-pointer";
  saveButton.id = "collectButton";
  saveButton.title = "Сохранить";
  saveButton.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="30" height="30"><path d="M12,10a4,4,0,1,0,4,4A4,4,0,0,0,12,10Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,16Z"/><path d="M22.536,4.122,19.878,1.464A4.966,4.966,0,0,0,16.343,0H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V7.657A4.966,4.966,0,0,0,22.536,4.122ZM17,2.08V3a3,3,0,0,1-3,3H10A3,3,0,0,1,7,3V2h9.343A2.953,2.953,0,0,1,17,2.08ZM22,19a3,3,0,0,1-3,3H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2V3a5.006,5.006,0,0,0,5,5h4a4.991,4.991,0,0,0,4.962-4.624l2.16,2.16A3.02,3.02,0,0,1,22,7.657Z"/></svg>
`;
  saveButton.onclick = function () {};
  menuItemsContainer.appendChild(saveButton);

  // Добавляем контейнер элементов меню в основной контейнер
  menuContainer.appendChild(menuItemsContainer);

  // Добавляем меню на страницу
  return menuContainer;
}

// window.addEventListener("load", function () {
//   var loadingScreen = document.getElementById("loadingScreen");
//   loadingScreen.style.display = "flex"; // Показать занавес загрузки
//   setTimeout(function () {
//     loadingScreen.style.display = "none"; // Скрыть занавес загрузки через 3 секунды
//   }, 2000);
// });

async function loadJsonFromLocalFile(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка при чтении файла:", error);
    throw error;
  }
}

(async () => {
  loadJsonFromLocalFile("js/data.json")
    .then((data) => {
      console.log(data);
      document
        .getElementById("headerMenuContainer")
        .appendChild(createNavigationMenu(data)); // Предполагая, что createNavigationMenu принимает `data` как аргумент
      ShowModal();

      // assembleButton.disabled = true;

      const inputs = document.querySelectorAll(".check-input");

      inputs.forEach((input) => {
        input.addEventListener("input", checkAllInputs);
      });

      const newLtkButton = document.getElementById("newLtkButton");
      newLtkButton.addEventListener("click", async () => {
        let param = document.getElementById("versionSelect").value; // Получаем ID версии
        console.log(param);
        let urlupdate = `https://${domain}/9x/app/php/create-new-tech-map.php?${urlParams}&tm_id=${param}`;
        await saveDelete(urlupdate);
        location.reload(); // Обновляем страницу
      });

      assembleButton.addEventListener("click", async () => {
        if (window.location.href.includes("diary-tasks")) {
          let allInputs = document.querySelectorAll(".check-input");
          let emptyInputs = Array.from(allInputs).filter(
            (input) => input.value.trim() === ""
          );
          let allFilled = emptyInputs.length === 0;

          if (!allFilled) {
            // Подсвечиваем не заполненные поля красным цветом
            emptyInputs.forEach((input) => {
              input.style.borderColor = "red";
            });

            // Создаем модальное окно
            let modal = document.createElement("div");
            modal.style.position = "fixed";
            modal.style.top = "50%";
            modal.style.left = "50%";
            modal.style.transform = "translate(-50%, -50%)";
            modal.style.backgroundColor = "white";
            modal.style.padding = "20px";
            modal.style.zIndex = "1000";
            modal.style.border = "1px solid black";
            modal.style.borderRadius = "5px";
            modal.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";

            // Создаем заголовок и список ссылок
            let title = document.createElement("h2");
            title.textContent =
              "Пожалуйста, заполните все необходимые поля. Не заполнены:";
            modal.appendChild(title);

            let list = document.createElement("ul");
            emptyInputs.forEach((input) => {
              let listItem = document.createElement("li");
              let link = document.createElement("a");
              link.href = "#";
              // Формируем текст ссылки, включая класс, тип и ID, если они есть
              let linkText = [];
              if (input.className) linkText.push(`Класс: ${input.className}`);
              if (input.type) linkText.push(`Тип: ${input.type}`);
              if (input.id) linkText.push(`ID: ${input.id}`);
              link.textContent = linkText.join(", ");
              link.onclick = (e) => {
                e.preventDefault();
                input.scrollIntoView({ behavior: "smooth" });
                input.focus();
                document.body.removeChild(modal);
              };
              listItem.appendChild(link);
              list.appendChild(listItem);
            });
            modal.appendChild(list);

            // Добавляем модальное окно на страницу
            document.body.appendChild(modal);
            return;
          }

          allInputs.forEach((input) => {
            input.style.borderColor = ""; // Сбрасываем стиль границы
          });

          // Получаем значение fullWeightValue
          let fullWeightValue = parseFloat(
            document.getElementById("full_weight").value
          );

          if (isNaN(fullWeightValue) || fullWeightValue < 100) {
            alert("Утвердить нельзя, так как процент должен быть равен 100.");
            return; // Прекращаем выполнение функции
          }

          const isConfirmed = confirm(
            `Вы точно хотите "Утвердить" данную версию ${currentPage}?`
          );
          if (isConfirmed) {
            saveTechMap();
            let param = document.getElementById("versionSelect").value;

            if (currentPage === "LTK") {
              urlupdate = `https://${domain}/9x/app/php/approve-tech-map.php?${urlParams}&tm_id=${param}`;
            } else if (currentPage === "PTK") {
              urlupdate = `https://${domain}/9x/app/php/approve-prod-tech-map.php?${urlParams}&tm_id=${param}`;
            }

            saveDelete(urlupdate);
          } else {
            console.log("Утверждение отменено пользователем.");
          }
        } else {
          alert(
            `Утвердить версию ЛТК можно только через задачу на Утверждение лабораторной техкарты`
          );
        }
      });

      const redactButton = document.getElementById("redactButton");
      redactButton.addEventListener("click", function () {
        // Получаем все элементы input и select
        const inputs = document.querySelectorAll("input, select");
        // Получаем все кнопки с классом 'btn block-ptk'
        const buttons = document.querySelectorAll(".btn .block-ptk"); // Исправлено здесь

        const buttonstwo = document.querySelectorAll(".block-ptk"); // Исправлено здесь
        // Получаем кнопку с ID 'addButton'
        const addButton = document.getElementById("addButton");

        // Разблокируем все элементы input и select
        inputs.forEach((input) => {
          input.disabled = false;
        });

        // Разблокируем все кнопки с классом 'btn block-ptk'
        buttons.forEach((button) => {
          button.disabled = false;
        });

        buttonstwo.forEach((button) => {
          button.disabled = false;
        });

        // Разблокируем кнопку с ID 'addButton'
        if (addButton) {
          addButton.disabled = false;
        }

        // Отображаем скрытую кнопку addPhaseButton
        if (addPhaseButton) {
          addPhaseButton.style.display = "block"; // или 'inline-block', в зависимости от вашего стиля
        }
      });

      const deletLTM = document.getElementById("deletLTM");

      deletLTM.addEventListener("click", async () => {
        // Запрашиваем подтверждение у пользователя
        const isConfirmed = confirm(
          "Вы точно хотите удалить данную версию ЛТК?"
        );
        if (isConfirmed) {
          let param = document.getElementById("versionSelect").value; // Получаем ID версии
          let urlupdate = `https://${domain}/9x/app/php/delete-version-ltm.php?${urlParams}&version_id=${param}`;
          await saveDelete(urlupdate);
          console.log(urlupdate);
          location.reload(); // Обновляем страницу
        } else {
          // Пользователь отменил действие
          console.log("Удаление отменено пользователем.");
        }
      });

      let collectButton = document.getElementById("collectButton"); // Кнопка Сохранить
      collectButton.addEventListener("click", function () {
        saveTechMap();
        // location.reload();
      });

      // Список с версиями тех карты
      let select = document.getElementById("versionSelect");
      Object.entries(data.data["tech-map"]).forEach(
        ([versionID, versionData]) => {
          let option = document.createElement("option");
          option.textContent =
            versionData?.laboratory_version ?? versionData.version; // Название версии
          option.value = versionID; // ID версии
          select.appendChild(option);
        }
      );

      document
        .getElementById("importButton")
        .addEventListener("click", function () {
          if (currentPage === "PTK") {
            alert("Экспорт в таблицу"); // Отображаем информацию для пользователя
            const tableId = prompt("Введите ID таблицы:");
            const id = select.value;
            console.log(tableId, id);

            if (tableId && id) {
              importTechMap(
                `https://${domain}/9x/app/php/export-ptk-to-table.php`,
                tableId,
                null,
                id,
                currentPage
              );
            }
          } else if (currentPage === "LTK") {
            alert("Импорт из таблицы"); // Отображаем информацию для пользователя
            const tableId = prompt("Введите ID таблицы:");
            const recipeVersion = prompt("Введите версию рецептуры:");
            const id = select.value;
            console.log(tableId, recipeVersion, id);

            if (tableId && recipeVersion && id) {
              importTechMap(
                `https://${domain}/9x/tech-map/importLtmHook.php`,
                tableId,
                recipeVersion,
                id,
                currentPage
              );
            }
          }
        });

      // Выбрать последний элемент
      select.selectedIndex = select.options.length - 1;

      let isAddPhaseButtonHandlerAdded = false;

      select.addEventListener("change", function () {
        if (!data.data["tech-map"][this.value]) return;
        let dataversion = data.data["tech-map"][this.value];
        window.dataversion = data.data["tech-map"][this.value];

        // Обработчик изменения веса
        let input = document.getElementById("global_weight");
        if (currentPage === "PTK") {
          input.disabled = true;
        }
        input.addEventListener("change", handleWeightChange);
        input.value = dataversion.weight;
        input.addEventListener("change", function () {
          const phaseElements = document.querySelectorAll(".percent");
          phaseElements.forEach((input) => {
            updateComponentWeight(input.closest(".phase"));
            updatePercentInPhasePer(input.closest(".phase"));
          });
        });

        function handleWeightChange() {
          const phaseElements = document.querySelectorAll(".phase");
          let totalPercent = 0;
          for (let phase of phaseElements) {
            totalPercent += updateTotalPercent(phase);
          }
        }

        // Очищаем контейнер для фаз
        const phasesContainer = document.getElementById("phasesContainer");
        phasesContainer.innerHTML = "";

        // Проверяем, утверждена ли техкарта или нет (Для птк и лтк)
        let isApproved;
        if (currentPage === "LTK") {
          isApproved = !!dataversion.approved_at;
        } else if (currentPage === "PTK") {
          isApproved = !!dataversion.collected_at;
        }

        const phasesData = Object.values(dataversion.phases);
        const selectsData = data.selects;
        const selectedPhases = [];

        this.setAttribute("data-dataversion-id", dataversion.ID);

        // Проверяем, существует ли уже сворачиваемый контейнер таблицы
        let collapsibleContainer =
          document.getElementById("collapsibleContent");
        if (!collapsibleContainer) {
          // Если контейнер не существует, создаем его
          collapsibleContainer = createCollapsibleTableContainer(
            data,
            dataversion
          );
          phasesContainer.appendChild(collapsibleContainer);
          // Если контейнер существует, обновляем его содержимое
          updateCollapsibleTableContainer(
            collapsibleContainer,
            data,
            dataversion
          );
        }

        //------------Отрисовка контейнера "Выходной контроль"------------------------

        let outputControlContainer = document.getElementById(
          "outputControlContainer"
        );
        if (!outputControlContainer) {
          const outputControlContainer =
            createOutputControlCollapsibleContainer(data, dataversion);
          phasesContainer.appendChild(outputControlContainer);
        } else {
          updateOutputControlCollapsibleContainer(
            outputControlContainer,
            data,
            dataversion
          );
        }

        if (currentPage === "PTK") {
          var container = document.getElementById(
            "outputControlCollapsibleContent"
          );
          if (container) {
            var elements = container.getElementsByTagName("*");
            for (var i = 0; i < elements.length; i++) {
              elements[i].disabled = true;
            }
          }
        }

        //------------Конец отрисовки контейнера "ВЫХОДНОЙ КОНТРОЛЬ"-------------------

        //-------------------Отрисовка контейнера "ИСПЫТАНИЯ"--------------------------

        // Проверяем, существует ли уже сворачиваемый контейнер (Испытания), если нет создаем его
        let ContainerTest = document.getElementById("ContainerTest");
        if (!ContainerTest) {
          const ContainerTest = createCollapsibleContainerTests(
            data,
            dataversion
          );
          phasesContainer.appendChild(ContainerTest);
        }

        // Скрываем контейнер в ПТК
        if (currentPage === "PTK") {
          var container = document.getElementById("CollapsibleContentTest");
          if (container) {
            var elements = container.getElementsByTagName("*");
            for (var i = 0; i < elements.length; i++) {
              elements[i].disabled = true;
            }
          }
        }

        //-------------------Конец отрисовки контейнера "ИСПЫТАНИЯ"---------------

        // Добавляем интерфейсы для каждой фазы, если они существуют
        if (phasesData.length > 0) {
          // Сортировка phasesData по num_phase в порядке возрастания
          phasesData.sort((a, b) => a.num_phase - b.num_phase);

          const accordion = document.createElement("div");
          accordion.className += "accordion border-radius box-shadow";

          // Accordion header
          const accordionHeader = document.createElement("div");
          accordionHeader.className +=
            "accordion-header d-flex justify-content-between align-items-center py-3 cursor-pointer";

          // Header left side: img, text
          const accordionLeft = document.createElement("div");
          accordionLeft.className += "d-flex align-items-center";

          const accordionLeftImg = document.createElement("img");
          accordionLeftImg.className = "ml-3";
          accordionLeftImg.src = "./img/accordion/layers.svg";
          accordionLeftImg.alt = "Фазы";

          const accordionLeftText = document.createElement("p");
          accordionLeftText.className += "h4 m-0 ml-3";
          accordionLeftText.textContent = "Фазы";

          accordionLeft.append(accordionLeftImg, accordionLeftText);

          // Header right side: text + switcher, img
          const accordionRight = document.createElement("div");

          const accordionRightImg = document.createElement("img");
          accordionRightImg.className += "mr-3 transition";
          accordionRightImg.src = "./img/accordion/open-arrow.svg";
          accordionRightImg.alt = "Открыть аккордеон";

          accordionRight.appendChild(accordionRightImg);

          accordionHeader.append(accordionLeft, accordionRight);
          accordion.appendChild(accordionHeader);

          // Detail box
          const detailBox = document.createElement("div");
          detailBox.className = "detail-box";

          // Inner box
          const innerBox = document.createElement("div");
          innerBox.className = "inner-box";

          // Transition box
          const transitionBox = document.createElement("div");
          transitionBox.className = "transition-box";

          // Accordion content
          const accordionContent = document.createElement("div");
          accordionContent.className = "transition content";

          transitionBox.appendChild(accordionContent);
          innerBox.appendChild(transitionBox);
          detailBox.appendChild(innerBox);
          accordion.appendChild(detailBox);

          // Show content on accodion click
          accordionHeader.addEventListener("click", function () {
            detailBox.classList.toggle("active");
            accordionRightImg.classList.toggle("rotate-180");
            accordionHeader.classList.toggle("border-bottom-only");
          });

          // Фаза 4. Фазы
          phasesData.forEach((phaseData) => {
            const phaseInterface = createPhaseInterface(
              phaseData,
              selectsData,
              dataversion,
              selectedPhases,
              data
            );
            accordionContent.appendChild(phaseInterface);
          });

          // Получаем кнопку с ID 'addPhaseButton'
          const addPhaseButton = document.getElementById("addPhaseButton");
          accordionContent.appendChild(addPhaseButton);

          phasesContainer.appendChild(accordion);
        }

        // Определяем контейнер для заголовка
        const headerContainer = document.getElementById("headerNameContainer"); // Предполагается, что у вас есть элемент с id="headerContainer" для заголовка

        // Удаляем предыдущий заголовок, если он существует
        if (headerContainer.firstChild) {
          headerContainer.removeChild(headerContainer.firstChild);
        }

        const header = document.createElement("h1");
        header.style.textAlign = "center"; // Выравниваем текст по центру

        //-------------------------Условия для версий LTK (Утверждена или Неутверждена)---------------------------

        if (isApproved) {
          // Если версия утверждена, скрываем кнопки и т.п
          document.getElementById("assembleButton").style.display = "none";
          document.getElementById("notApproveButton").style.display = "none";
          if (currentPage === "LTK") {
            document.getElementById("addPhaseButton").style.display = "none";
          }
          document.getElementById("deletLTM").style.display = "none";
          phasesContainer
            .querySelectorAll("input, select, button")
            .forEach((element) => {
              if (element.textContent !== "Вывод состава") {
                element.disabled = true;
              }
            });

          document.querySelectorAll(".m9-add-component").forEach((button) => {
            button.style.display = "block";
          });

          document.querySelectorAll(".copyname").forEach((select) => {
            select.disabled = false; // Установка атрибута disabled в false
          });

          // Скрываем все кнопки "Удалить" внутри элементов с классом card
          document
            .querySelectorAll(".card .btn .btn-danger")
            .forEach((button) => {
              button.style.display = "block";
            });

          // Если версия ПТК сформирована, отображаем заголовок "Сформированный ПТК"
          if (currentPage === "PTK") {
            header.textContent = "Сформированный ПТК";
            phasesContainer
              .querySelectorAll(".block-ptk")
              .forEach((element) => {
                // const label = element.previousElementSibling;
                // label.style.display = "none";
                element.style.display = "none";
              });
            phasesContainer
              .querySelectorAll(".disabled-ptk")
              .forEach((element) => {
                element.style.pointerEvents = "none"; // Делает элемент неактивным для событий мыши
                element.style.opacity = "0.5"; // Делает элемент полупрозрачным, чтобы показать, что он неактивен
              });
            document.getElementById("addPhaseButton").style.display = "none";

            document.querySelectorAll(".copyname").forEach((select) => {
              select.disabled = false; // Установка атрибута disabled в false
            });

            // Если версия ЛТК утверждена, отображаем заголовок "Утвержденная ЛТК"
          } else if (currentPage === "LTK") {
            header.textContent = "Утвержденная ЛТК";
            const classesToRemove = [
              ".type_of_equipment",
              ".time_general",
              ".equipment_id",
              ".rotation_mixing",
              ".feed_type_id",
              ".type_of_equipment_id",
              ".tool_id",
            ];
            classesToRemove.forEach((className) => {
              phasesContainer
                .querySelectorAll(className)
                .forEach(removeElementAndLabel);
            });
          }
        } else {
          // Если версия не утверждена, отображаем кнопки и т.п
          document.getElementById("assembleButton").style.display =
            "inline-block";
          document.getElementById("notApproveButton").style.display =
            "inline-block";
          if (currentPage === "LTK") {
            document.getElementById("addPhaseButton").style.display = "block";
          }
          document.getElementById("deletLTM").style.display = "inline-block";
          document.querySelectorAll(".m9-add-component").forEach((button) => {
            button.style.display = "block";
          });
          // Отображаем все кнопки "Удалить" внутри элементов с классом card
          document
            .querySelectorAll(".card .btn.btn-danger")
            .forEach((button) => {
              button.style.display = "block";
            });

          // Если версия ПТК не сформирована, отображаем заголовок "Бланк ПТК"
          if (currentPage === "PTK") {
            header.textContent = "Бланк ПТК";
            phasesContainer
              .querySelectorAll(".airing_id, .mixing_intensity_id, .ph")
              .forEach((element) => {
                element.disabled = true;
              });
            phasesContainer
              .querySelectorAll(".block-ptk")
              .forEach((element) => {
                // const label = element.previousElementSibling;
                // label.style.display = "none";
                element.style.display = "none";
              });
            phasesContainer
              .querySelectorAll(".disabled-ptk")
              .forEach((element) => {
                element.style.pointerEvents = "none"; // Делает элемент неактивным для событий мыши
                element.style.backgroundColor = "#e9ecef"; // Устанавливает фоновый цвет элемента
              });
            document.getElementById("addPhaseButton").style.display = "none";

            // Если версия ЛТК утверждена, отображаем заголовок "Утвержденная ЛТК"
          } else if (currentPage === "LTK") {
            header.textContent = "Бланк ЛТК";
            const classesToRemove = [
              ".type_of_equipment",
              ".time_general",
              ".equipment_id",
              ".rotation_mixing",
              ".feed_type_id",
              ".type_of_equipment_id",
              ".tool_id",
            ];
            classesToRemove.forEach((className) => {
              phasesContainer
                .querySelectorAll(className)
                .forEach(removeElementAndLabel);
            });
          }
        }

        // Добавляем заголовок в контейнер
        headerContainer.appendChild(header);

        //----------------------------------------------------------Конец---------------------------------------------------------------------------------

        // Добавляем обработчик событий для кнопки добавления фазы, если он еще не был добавлен
        let addPhaseButton = document.getElementById("addPhaseButton");
        addPhaseButton.className = "block-ptk";
        if (addPhaseButton && !isAddPhaseButtonHandlerAdded) {
          addPhaseButton.addEventListener("click", function () {
            const newPhaseInterface = createPhaseInterface(
              phasesData,
              selectsData,
              dataversion,
              selectedPhases,
              data
            );
            phasesContainer.appendChild(newPhaseInterface);
          });
          isAddPhaseButtonHandlerAdded = true;
        }

        const phaseElement = document.querySelectorAll(".percent");
        phaseElement.forEach((input) => {
          updateComponentWeight(input.closest(".phase"));
          updatePercentInPhasePer(input.closest(".phase"));
          updateFullWeight();
        });

        if (currentPage === "PTK") {
          const phaseBlocks = document.querySelectorAll(".card.phase");
          if (phaseBlocks.length > 0) {
            phaseBlocks.forEach((phaseBlock) => {
              calculateTotalTime(phaseBlock);
            });
          } else {
            console.log("Фазы не найдены.");
          }
        }

        let updated_at = document.getElementById("updated_at");
        if (dataversion.updated_at === undefined) {
          updated_at.value = "Не сохраняли";
          updated_at.style.width = "180px";
        } else {
          updated_at.value = dataversion.updated_at;
          updated_at.style.width = "180px";
        }

        let updated_by = document.getElementById("updated_by");
        if (dataversion.updated_by === undefined) {
          updated_by.value = "Ф.И.О";
          updated_by.style.width = "220px";
        } else {
          updated_by.value = dataversion.updated_by;
          updated_by.style.width = "220px";
        }

        let price = document.getElementById("price");
        if (dataversion.updated_by === undefined) {
          price.value = "Цены нет";
          price.style.width = "100px";
        } else {
          price.value = dataversion.price;
          price.style.width = "100px";
        }
      });

      select.dispatchEvent(new Event("change"));
    })
    .catch((error) => {
      console.error("Ошибка при получении данных из файла:", error);
    });
})();
