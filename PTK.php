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
  <link rel="stylesheet" type="text/css" href="css/PTK.css?v=<?php echo $currentTime; ?>">
  <title>ПТК</title>
</head>

<body data-page="PTK">
  <div id="loadingScreen" style="display:none;">
    <img src="/9x/tech-map/icons/37 (1).gif" alt="Загрузка" style="width: 80px; height: 80px;">
  </div>
  <div id="headerMenuContainer"></div>
  <div id="headerContainer"></div>
  <div class="modal fade" id="dataModal" tabindex="-1" role="dialog" aria-labelledby="dataModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="dataModalLabel">Рецептура</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-container">
            <label>Общий процент: </label>
            <input type="text" readonly="true">
          </div>
          <table class="table" id="dataTable">
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


  <div id="formContainer"></div>

  <div id="modal" class="modal" style="display: none; width: 100vw; height: 100vh;"></div>

  <div class="flex-container">
    <select class="m9-input versiontk version-select" id="versionSelect"></select>

    <input class="m9-input global_weight" id="global_weight" title="Общий вес на продукт" type="number">

    <input class="m9-input full_weight" id="full_weight" title="Сумма процентов всех компонентов" type="number"
      disabled>

    <input class="m9-input" id="updated_at" title="Когда сохранили" disabled>

    <input class="m9-input" id="updated_by" title="Кто сохранил" disabled>
  </div>

  <div id="phasesContainer"></div>

  <button id="addPhaseButton" title="Добавить фазу">
    <img src="icons/icons8-add-new-96.png" alt="Добавить фазу">
  </button>

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