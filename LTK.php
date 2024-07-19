<?php
$currentTime = time();
?>
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
  <!-- <link rel="stylesheet" type="text/css" href="https://m9app.online/9x/tech-map/css/LTK.css?15"> -->
  <link rel="stylesheet" type="text/css" href="css/m9-style.css?v=<?php echo $currentTime; ?>">
  <link rel="stylesheet" type="text/css" href="css/LTK.css?v=<?php echo $currentTime; ?>">
  <title>ЛТК</title>
</head>

<body data-page="LTK">
  <!-- custom select-option dropdown -->
  <!-- Для проверки рекомендуется разкомментить в LTK.css первые строки и в TK.js последние -->
  <!-- <div class="dropdown">
    <div class="dropdown-select">
      <span class="select">Default value</span>
      <img class="arrow" src="./img/input/unactive-arrow.svg" alt="Стрелка">
      <img class="close-input" src="./img/input/close-input.svg" alt="Крестик">
    </div>
    <div class="dropdown-selected"></div>
    <div class="dropdown-list">
      <div class="dropdown-list__item">1</div>
      <div class="dropdown-list__item">2</div>
      <div class="dropdown-list__item">3</div>
    </div>
  </div> -->

  <!-- custom disabled select-option dropdown -->
  <!-- <div class="dropdown">
    <div class="dropdown-select disabled">
      <span class="select">Default value</span>
      <img class="arrow" src="./img/input/unactive-arrow.svg" alt="Стрелка">
      <img class="close-input" src="./img/input/close-input.svg" alt="Крестик">
    </div>
    <div class="dropdown-selected"></div>
    <div class="dropdown-list">
      <div class="dropdown-list__item">1</div>
      <div class="dropdown-list__item">2</div>
      <div class="dropdown-list__item">3</div>
    </div>
  </div> -->

  <!-- <div id="loadingScreen" style="display:none;">
    <img src="icons/37 (1).gif" alt="Загрузка" style="width: 80px; height: 80px;">
  </div> -->
  <div id="headerMenuContainer"></div>
  <div id="headerContainer"></div>
  <div class="modal fade m9-container" id="dataModal" tabindex="-1" role="dialog" aria-labelledby="dataModalLabel"
    aria-hidden="true" style="margin:0px">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content m9-container">
        <div class="modal-header m9-container">
          <h5 class="modal-title" id="dataModalLabel">Рецептура</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body m9-container">
          <div class="form-container">
            <label>Общий процент: </label>
            <input type="text" class="m9-input" readonly="true">
          </div>
          <table class="m9-table" id="dataTable">
            <thead>
              <tr>
                <th scope="col">INCI</th>
                <th scope="col">Химическое название</th>
                <th scope="col">Поставщик</th>
                <th scope="col">Название по накладной</th>
                <th scope="col">% от общего веса</th>
              </tr>
            </thead>
            <tbody id="tableBody">
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <div id="customAlert"
    style="display: none; position: fixed; z-index: 1; right: 20px; bottom: 20px; width: 30%; height: auto; overflow: auto; background-color: rgba(0,0,0,0.8); border-radius: 10px;">
    <div style="background-color: #fefefe; padding: 20px; border-radius: 10px;">
      <p id="customAlertMessage" style="margin: 0; padding: 0; font-size: 18px; font-weight: bold;"></p>
    </div>
  </div>

  <div id="formContainer"></div>

  <div id="modal" class="modal" style="display: none; width: 100vw; height: 100vh;"></div>

  <div class="flex-container">
    <select class="m9-input versiontk version-select" id="versionSelect"></select>

    <input class="m9-input global_weight" id="global_weight" title="Общий вес на продукт" type="number">

    <input class="m9-input full_weight" id="full_weight" title="Сумма процентов всех компонентов" type="number"
      disabled>

    <input class="m9-input" id="updated_at" title="Когда сохранили" disabled>

    <input class="m9-input" id="updated_by" title="Кто сохранил" disabled>

    <input class="m9-input" id="price" title="Цена рецептуры" disabled>

  </div>

  <div id="phasesContainer"></div>

  <button id="addPhaseButton" title="Добавить фазу">Добавить фазу +</button>

  <!-- Custom full-screen overlay -->
  <div id="full-screen-overlay">
    <img src="" alt="" id="full-screen-image">
  </div>

  <!-- Подключение jQuery из CDN -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

  <!-- Подключение Bootstrap и Popper.js из CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js"></script>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.12.6/css/selectize.default.css" />
  <link rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.12.6/css/selectize.bootstrap3.css" />

  <!-- Подключение selectize.js -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.12.6/js/standalone/selectize.min.js"></script>
  <!-- Подключение вашего собственного скрипта -->

  <script src="js/TK.js?v=<?php echo $currentTime; ?>"></script>
  <!-- <script src="https://m9app.online/9x/tech-map/js/TK?15"></script> -->
</body>

</html>