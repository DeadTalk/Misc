/*
 * Script Name: Single Village Planner
 * Version: v1.1.9
 * Last Updated: 2021-04-24
 * Author: RedAlert
 * Author URL: https://twscripts.dev/
 * Author Contact: RedAlert#9859 (Discord)
 * Approved: t14559753
 * Approved Date: 2021-02-11
 * Mod: JawJaw
 */

var scriptData = {
	name: 'Single Village Planner',
	version: 'v1.1.9',
	author: 'RedAlert',
	authorUrl: 'https://twscripts.dev/',
	helpLink: 'https://forum.tribalwars.net/index.php?threads/single-village-planner.286667/',
};

// User Input
if (typeof DEBUG !== 'boolean') DEBUG = false;

// Constants
var LS_PREFIX = 'raSingleVillagePlanner';
var TIME_INTERVAL = 60 * 60 * 1000 * 24 * 365; // unit info does not change during the whole world duration so we only need to get it once
var GROUP_ID = localStorage.getItem(`${LS_PREFIX}_chosen_group`) ?? 0;
var LAST_UPDATED_TIME = localStorage.getItem(`${LS_PREFIX}_last_updated`) ?? 0;

// Globals
var unitInfo,
	troopCounts = [];

// Translations
var translations = {
	en_DK: {
		'Single Village Planner': 'Single Village Planner',
		Help: 'Help',
		'This script can only be run on a single village screen!':
			'This script can only be run on a single village screen!',
		Village: 'Village',
		'Calculate Launch Times': 'Calculate Launch Times',
		Reset: 'Reset',
		'Launch times are being calculated ...': 'Launch times are being calculated ...',
		'Missing user input!': 'Missing user input!',
		'Landing Time': 'Landing Time',
		'This village has no unit selected!': 'This village has no unit selected!',
		'Prio.': 'Prio.',
		'No possible combinations found!': 'No possible combinations found!',
		'Export Plan as BB Code': 'Export Plan as BB Code',
		'Plan for:': 'Plan for:',
		'Landing Time:': 'Landing Time:',
		Unit: 'Unit',
		'Launch Time': 'Launch Time',
		Command: 'Command',
		Status: 'Status',
		Send: 'Send',
		From: 'From',
		Priority: 'Priority',
		'Early send': 'Early send',
		'Landing time was updated!': 'Landing time was updated!',
		'Error fetching village groups!': 'Error fetching village groups!',
		'Dist.': 'Dist.',
		'Villages list could not be fetched!': 'Villages list could not be fetched!',
		Group: 'Group',
	},
	en_US: {
		'Single Village Planner': 'Single Village Planner',
		Help: 'Help',
		'This script can only be run on a single village screen!':
			'This script can only be run on a single village screen!',
		Village: 'Village',
		'Calculate Launch Times': 'Calculate Launch Times',
		Reset: 'Reset',
		'Launch times are being calculated ...': 'Launch times are being calculated ...',
		'Missing user input!': 'Missing user input!',
		'Landing Time': 'Landing Time',
		'This village has no unit selected!': 'This village has no unit selected!',
		'Prio.': 'Prio.',
		'No possible combinations found!': 'No possible combinations found!',
		'Export Plan as BB Code': 'Export Plan as BB Code',
		'Plan for:': 'Plan for:',
		'Landing Time:': 'Landing Time:',
		Unit: 'Unit',
		'Launch Time': 'Launch Time',
		Command: 'Command',
		Status: 'Status',
		Send: 'Send',
		From: 'From',
		Priority: 'Priority',
		'Early send': 'Early send',
		'Landing time was updated!': 'Landing time was updated!',
		'Error fetching village groups!': 'Error fetching village groups!',
		'Dist.': 'Dist.',
		'Villages list could not be fetched!': 'Villages list could not be fetched!',
		Group: 'Group',
	},
	sk_SK: {
		'Single Village Planner': 'PlÃ¡novaÄ pre jednu dedinu',
		Help: 'Pomoc',
		'This script can only be run on a single village screen!':
			'Tento skript sa dÃ¡ spustiÅ¥ iba v nÃ¡hÄ¾ade dediny z mapy',
		Village: 'Dedina',
		'Calculate Launch Times': 'VÃ½poÄet Äasov odoslania',
		Reset: 'Reset',
		'Launch times are being calculated ...': 'ÄŒasy odoslania sa vypoÄÃ­tavajÃº ...',
		'Missing user input!': 'ChÃ½ba oznaÄenie jednotiek!',
		'Landing Time': 'ÄŒas dopadu',
		'This village has no unit selected!': 'TÃ¡to dedina nemÃ¡ oznaÄenÃº jednotku!',
		'Prio.': 'Prio.',
		'No possible combinations found!': 'Å½iadne moÅ¾nÃ© kombinÃ¡cie sa nenaÅ¡li!',
		'Export Plan as BB Code': 'ExportovaÅ¥ PlÃ¡n ako BB KÃ³dy',
		'Plan for:': 'PlÃ¡n pre:',
		'Landing Time:': 'ÄŒas dopadu:',
		Unit: 'Jednotka',
		'Launch Time': 'ÄŒas odoslania:',
		Command: 'PrÃ­kaz',
		Status: 'Stav',
		Send: 'OdoslaÅ¥',
		From: 'Z',
		Priority: 'Priorita',
		'Early send': 'SkorÃ© odoslanie',
		'Landing time was updated!': 'ÄŒas dopadu aktualizovanÃ½!',
		'Error fetching village groups!': 'Chyba pri naÄÃ­tanÃ­ skupiny dedÃ­n',
		'Dist.': 'VzdialenosÅ¥',
		'Villages list could not be fetched!': 'Villages list could not be fetched!',
		Group: 'Group',
	},
	nl_NL: {
		'Single Village Planner': 'Enkel Dorp Planner',
		Help: 'Help',
		'This script can only be run on a single village screen!':
			'Het script kan enkel worden uitgevoerd op het dorpsoverzicht via de kaart!',
		Village: 'Dorp',
		'Calculate Launch Times': 'Bereken verzendtijden',
		Reset: 'Reset',
		'Launch times are being calculated ...': 'Verzendtijden worden berekend ...',
		'Missing user input!': 'Mis spelersinvoer!',
		'Landing Time': 'Landingstijd',
		'This village has no unit selected!': 'Dit dorp heeft geen troepen geselecteerd!',
		'Prio.': 'Prioriteit.',
		'No possible combinations found!': 'Geen mogelijkheden gevonden!',
		'Export Plan as BB Code': 'Exporteer plan als BB Code',
		'Plan for:': 'Plan voor:',
		'Landing Time:': 'Landingstijd:',
		Unit: 'Eenheid',
		'Launch Time': 'Verzendtijd',
		Command: 'Bevel',
		Status: 'Status',
		Send: 'Zend',
		From: 'Van',
		Priority: 'Prioriteit',
		'Early send': 'Vroeg verzenden',
		'Landing time was updated!': 'Aankomsttijd is geupdate!',
		'Error fetching village groups!': 'Fout met ophalen van dorpen uit groep!',
		'Dist.': 'Afstand',
		'Villages list could not be fetched!': 'Villages list could not be fetched!',
		Group: 'Group',
	},
	el_GR: {
		'Single Village Planner': 'Î‘Ï„Î¿Î¼Î¹ÎºÏŒ Î Î»Î¬Î½Î¿ Î§Ï‰ÏÎ¹Î¿Ï',
		Help: 'Î’Î¿Î®Î¸ÎµÎ¹Î±',
		'This script can only be run on a single village screen!': 'Î‘Ï…Ï„Î¿ Ï„Î¿ Script Ï„ÏÎ­Ï‡ÎµÎ¹ Î±Ï€Î¿ Î Î»Î·ÏÎ¿Ï†Î¿ÏÎ¯ÎµÏ‚ Î§Ï‰ÏÎ¹Î¿Ï!',
		Village: 'Î§Ï‰ÏÎ¹ÏŒ',
		'Calculate Launch Times': 'Î¥Ï€Î¿Î»ÏŒÎ³Î¹ÏƒÎµ ÎÏÎ± Î•ÎºÎºÎ¯Î½Î·ÏƒÎ·Ï‚',
		Reset: 'Î•Ï€Î±Î½Î±Ï†Î¿ÏÎ¬',
		'Launch times are being calculated ...': 'ÎŸÎ¹ Ï‡ÏÏŒÎ½Î¿Î¹ ÎµÎºÎºÎ¯Î½Î·ÏƒÎ·Ï‚ Ï…Ï€Î¿Î»Î¿Î³Î¯Î¶Î¿Î½Ï„Î±Î¹ ...',
		'Missing user input!': 'Î›ÎµÎ¯Ï€Î¿Ï…Î½ Ï„Î± Î´ÎµÎ´Î¿Î¼Î­Î½Î±!',
		'Landing Time': 'ÎÏÎ± Î¬Ï†Î¹Î¾Î·Ï‚',
		'This village has no unit selected!': 'Î¤Î¿ Ï‡Ï‰ÏÎ¹ÏŒ Î´ÎµÎ½ Î­Ï‡ÎµÎ¹ ÎµÏ€Î¹Î»ÎµÎ³Î¼Î­Î½ÎµÏ‚ Î¼Î¿Î½Î¬Î´ÎµÏ‚!',
		'Prio.': 'Î ÏÎ¿Ï„.',
		'No possible combinations found!': 'No possible combinations found!',
		'Export Plan as BB Code': 'Î•Î¾Î±Î³Ï‰Î³Î® Ï€Î»Î¬Î½Î¿Ï… ÏƒÎµ BB Code',
		'Plan for:': 'Î Î»Î¬Î½Î¿ Î³Î¹Î±:',
		'Landing Time:': 'ÎÏÎ± Î¬Ï†Î¹Î¾Î·Ï‚:',
		Unit: 'ÎœÎ¿Î½Î¬Î´Î±',
		'Launch Time': 'ÎÏÎ± ÎµÎºÎºÎ¯Î½Î·ÏƒÎ·Ï‚',
		Command: 'Î•Î½Ï„Î¿Î»Î®',
		Status: 'ÎšÎ±Ï„Î¬ÏƒÏ„Î±ÏƒÎ·',
		Send: 'Î£Ï„ÎµÎ¯Î»Îµ',
		From: 'Î‘Ï€ÏŒ',
		Priority: 'Î ÏÎ¿Ï„ÎµÏÎ±Î¹ÏŒÏ„Î·Ï„Î±',
		'Early send': 'Î£Ï„Î¬Î»Î¸Î·ÎºÎ±Î½ Î½Ï‰ÏÎ¯Ï„ÎµÏÎ±',
		'Landing time was updated!': 'Î— ÏŽÏÎ± Î¬Ï†Î¹Î¾Î·Ï‚ Î±Î½Î±Î½ÎµÏŽÎ¸Î·ÎºÎµ!',
		'Error fetching village groups!': 'Î£Ï†Î¬Î»Î¼Î± ÎºÎ±Ï„Î¬ Ï„Î·Î½ Î±Î½Î¬ÎºÏ„Î·ÏƒÎ· Î¿Î¼Î¬Î´Ï‰Î½ Ï‡Ï‰ÏÎ¹ÏŽÎ½!',
		'Dist.': 'Î‘Ï€ÏŒÏƒÏ„Î±ÏƒÎ·',
		'Villages list could not be fetched!': 'Villages list could not be fetched!',
		Group: 'Group',
	},
	it_IT: {
		'Single Village Planner': 'Planner Singolo Villo',
		Help: 'Aiuto',
		'This script can only be run on a single village screen!':
			'Questo script puÃ² essere lanciato solo dalla panoramica del villaggio!',
		Village: 'Villaggio',
		Coords: 'Coordinate',
		Continent: 'Continente',
		'Calculate Launch Times': 'Calcola tempi di lancio',
		Reset: 'Reset',
		'Launch times are being calculated ...': 'I tempi di lancio sono stati calcolati ...',
		'Missing user input!': 'Manca selezione truppe!',
		'Landing Time': 'Tempo di arrivo',
		'This village has no unit selected!': 'Questo villaggio non ha le unitÃ  selezionate!',
		'Prio.': 'Prio.',
		'No possible combinations found!': 'Nessuna combinazione possibile!',
		'Export Plan as BB Code': 'Esporta il plan in BB code',
		'Plan for:': 'Plan per:',
		'Landing Time:': 'Tempo di arrivo:',
		Unit: 'EnitÃ ',
		'Launch Time': 'Tempo di lancio',
		Command: 'Comando',
		Status: 'Status',
		Send: 'Invia',
		From: 'Da',
		Priority: 'PrioritÃ ',
		'Early send': 'Anticipa invio',
		'Landing time was updated!': 'Il tempo di arrivo Ã¨ stato aggiornato!',
		'Error fetching village groups!': 'Errore nel recupero gruppo!',
		'Dist.': 'Dist.',
		'Villages list could not be fetched!': 'Errore nel recupero villaggi!',
		Group: 'Gruppo',
	},
	tr_TR: {
		'Single Village Planner': 'Tek KÃ¶y PlanlayÄ±cÄ±sÄ±',
		Help: 'YardÄ±m',
		'This script can only be run on a single village screen!':
			'Bu komut dosyasÄ± yalnÄ±zca tek bir kÃ¶y ekranÄ±nda Ã§alÄ±ÅŸtÄ±rÄ±labilir',
		Village: 'KÃ¶y',
		Coords: 'Koordinat',
		Continent: 'KÄ±ta',
		'Calculate Launch Times': 'BaÅŸlatma SÃ¼relerini HesaplayÄ±n',
		Reset: 'Reset',
		'Launch times are being calculated ...': 'BaÅŸlatma sÃ¼releri hesaplanÄ±yor ...',
		'Missing user input!': 'Eksik kullanÄ±cÄ± giriÅŸi!',
		'Landing Time': 'iniÅŸ zamanÄ±',
		'This village has no unit selected!': 'Bu kÃ¶yde seÃ§ili birim yok!',
		'Prio.': 'Prio.',
		'No possible combinations found!': 'OlasÄ± kombinasyon bulunamadÄ±!',
		'Export Plan as BB Code': 'PlanÄ± BB Kodu Olarak DÄ±ÅŸa Aktar',
		'Plan for:': 'Plan iÃ§in:',
		'Landing Time:': 'Ä°niÅŸ zamanÄ±:',
		Unit: 'Birim',
		'Launch Time': 'BaÅŸlatma ZamanÄ±:',
		Command: 'Komut',
		Status: 'Durum',
		Send: 'GÃ¶nder',
		From: 'Z',
		Priority: 'Ã–ncelik',
		'Early send': 'erken gÃ¶nder',
		'Landing time was updated!': 'Ä°niÅŸ zamanÄ± gÃ¼ncellendi!',
		'Error fetching village groups!': 'KÃ¶y gruplarÄ± getirilirken hata oluÅŸtu',
		'Dist.': 'Dist.',
		'Villages list could not be fetched!': 'Villages list could not be fetched!',
		Group: 'Group',
	},
};

// Init Debug
initDebug();

// Init Translations Notice
initTranslationsNotice();

// Fetch unit config only when needed
if (LAST_UPDATED_TIME !== null) {
	if (Date.parse(new Date()) >= LAST_UPDATED_TIME + TIME_INTERVAL) {
		fetchUnitInfo();
	} else {
		unitInfo = JSON.parse(localStorage.getItem(`${LS_PREFIX}_unit_info`));
	}
} else {
	fetchUnitInfo();
}

// Initialize Attack Planner
async function initAttackPlanner(groupId) {
	// run on script load
	const groups = await fetchVillageGroups();
	troopCounts = await fetchTroopsForCurrentGroup(groupId);
	const villages = await fetchAllPlayerVillagesByGroup(groupId);
	const content = prepareContent(villages, groups);
	renderUI(content);

	// after script has been loaded events
	setTimeout(function () {
		// set a default landing time
		const today = new Date().toLocaleString('en-GB').replace(',', '');
		jQuery('#raLandingTime').val(today);

		// handle non-archer worlds
		if (!game_data.units.includes('archer')) {
			jQuery('.archer-world').hide();
		}

		// handle non-paladin worlds
		if (!game_data.units.includes('knight')) {
			jQuery('.paladin-world').hide();
		}
	}, 100);

	// scroll to element to focus user's attention
	jQuery('html,body').animate({ scrollTop: jQuery('#raSingleVillagePlanner').offset().top - 8 }, 'slow');

	// action handlers
	choseUnit();
	changeVillagePriority();
	calculateLaunchTimes();
	resetAll();
	fillLandingTimeFromCommand();
	filterVillagesByChosenGroup();
	setAllUnits();
}

// Helper: Prepare UI
function prepareContent(villages, groups) {
	const villagesTable = renderVillagesTable(villages);
	const groupsFilter = renderGroupsFilter(groups);

	return `
		<div class="ra-mb15">
			<div class="ra-grid">
				<div>
					<label for="raLandingTime">
						${tt('Landing Time')} (dd/mm/yyyy HH:mm:ss)
					</label>
					<input id="raLandingTime" type="text" value="" />
				</div>
				<div>
					<label>${tt('Group')}</label>
					${groupsFilter}
				</div>
			</div>
		</div>
		<div class="ra-mb15">
			${villagesTable}
		</div>
		<div class="ra-mb15">
			<a href="javascript:void(0);" id="calculateLaunchTimes" class="btn btn-confirm-yes">
				${tt('Calculate Launch Times')}
			</a>
			<a href="javascript:void(0);" id="resetAll" class="btn btn-confirm-no">
				${tt('Reset')}
			</a>
		</div>
		<div style="display:none;" class="ra-mb-15" id="raVillagePlanner">
			<label for="raExportPlanBBCode">${tt('Export Plan as BB Code')}</label>
			<textarea id="raExportPlanBBCode" readonly></textarea>
		</div>
	`;
}

// Render UI
function renderUI(body) {
	const content = `
        <div class="ra-single-village-planner" id="raSingleVillagePlanner">
            <h2>${tt(scriptData.name)}</h2>
            <div class="ra-single-village-planner-data">
                ${body}
            </div>
            <br>
            <small>
                <strong>
                    ${tt(scriptData.name)} ${scriptData.version}
                </strong> -
                <a href="${scriptData.authorUrl}" target="_blank" rel="noreferrer noopener">
                    ${scriptData.author}
                </a> -
                <a href="${scriptData.helpLink}" target="_blank" rel="noreferrer noopener">
                    ${tt('Help')}
                </a>
            </small>
        </div>
        <style>
            .ra-single-village-planner { position: relative; display: block; width: auto; height: auto; clear: both; margin: 0 auto 15px; padding: 10px; border: 1px solid #603000; box-sizing: border-box; background: #f4e4bc; }
			.ra-single-village-planner * { box-sizing: border-box; }
			.ra-single-village-planner input[type="text"] { width: 100%; padding: 5px 10px; border: 1px solid #000; font-size: 16px; line-height: 1; }
			.ra-single-village-planner label { font-weight: 600 !important; margin-bottom: 5px; display: block; }
			.ra-single-village-planner select { width: 100%; padding: 5px 10px; border: 1px solid #000; font-size: 16px; line-height: 1; }
			.ra-single-village-planner textarea { width: 100%; height: 100px; resize: none; padding: 5px 10px; }
			.ra-single-village-planner .ra-grid { display: grid; grid-template-columns: 1fr 150px; grid-gap: 0 20px; }
			.ra-table { border-collapse: separate !important; border-spacing: 2px !important; }
			.ra-table tbody tr:hover td { background-color: #ffdd30 !important; }
			.ra-table tbody tr.ra-selected-village td { background-color: #ffe563 !important; }
			.ra-table th { font-size: 14px; }
			.ra-table th,
            .ra-table td { padding: 4px; text-align: center; }
            .ra-table td a { word-break: break-all; }
			.ra-table tr:nth-of-type(2n+1) td { background-color: #fff5da; }
			.ra-table td img { padding: 2px; border: 2px solid transparent; cursor: pointer; }
			.ra-table td img.ra-selected-unit { border: 2px solid #ff0000; }
			.ra-table a:focus { color: blue; }
			.ra-table th .icon { transform: scale(1.05); margin: 0; }
			.ra-table th img { cursor: pointer; }
			.ra-table th.ra-unit-toggle:hover { background-color: rgba(97, 48, 0, 0.6) !important; background-image: none !important; cursor: pointer !important; }
			.ra-table td .icon { filter: grayscale(100%); transform: scale(1.05); margin: 0; cursor: pointer; }
			.ra-table td .icon.ra-priority-village { filter: none !important; }
			.ra-table td span { transform: translateY(-6px); position: relative; display: inline-block; }
			.ra-chosen-command td { background-color: #ffe563; }
			.ra-groups-filter { display: inline-block; margin: 0; padding: 0; text-align: center; }
			.ra-groups-filter li { display: inline-block; list-style-type: none; margin: 0 10px; }
			.ra-groups-filter li:first-child { margin-left: 0; }
			.ra-groups-filter li:last-child { margin-right: 0; }
			.ra-selected-group { color: #21881e; }

			/* Helper Classes */
			.ra-fw600 { font-weight: 600; }
			.ra-mb15 { margin-bottom: 15px; }
			.ra-dblock { display: block; }
			.ra-dflex { display: flex; }
			.ra-text-left { text-align: left !important; }
        </style>
    `;

	if (jQuery('.ra-single-village-planner').length < 1) {
		jQuery('#contentContainer').prepend(content);
	} else {
		jQuery('.ra-single-village-planner-data').html(body);
	}
}

// Action Handler: Here is the logic to collect units
function choseUnit() {
	jQuery('.ra-table td img').on('click', function () {
		// toggle state of chosen unit
		jQuery(this).parent().parent().find('img').not(this).removeClass('ra-selected-unit');
		jQuery(this).toggleClass('ra-selected-unit');

		// toggle state of chosen village
		jQuery('#raAttackPlannerTable tbody tr').each(function () {
			const isAnyUnitSelected = jQuery(this).find('img.ra-selected-unit')[0];
			if (isAnyUnitSelected) {
				jQuery(this).addClass('ra-selected-village');
			} else {
				jQuery(this).find('td .icon').removeClass('ra-priority-village');
				jQuery(this).removeClass('ra-selected-village');
			}
		});
	});
}

// Action Handler: Change the village send priority
function changeVillagePriority() {
	jQuery('#raAttackPlannerTable tbody td .icon').on('click', function () {
		const isUnitSelectedForVillage = jQuery(this).parent().parent().find('.ra-selected-unit')[0];
		if (isUnitSelectedForVillage) {
			jQuery(this).toggleClass('ra-priority-village');
		} else {
			UI.ErrorMessage(tt('This village has no unit selected!'));
		}
	});
}

// Action Handler: Grab the "chosen" villages and calculate their launch times based on the unit type
function calculateLaunchTimes() {
	jQuery('#calculateLaunchTimes').on('click', function (e) {
		e.preventDefault();

		const landingTimeString = jQuery('#raLandingTime').val().trim();
		const destinationVillage = jQuery('#content_value table table td:eq(2)').text();

		let villagesUnitsToSend = [];

		// collect user input
		jQuery('#raAttackPlannerTable .ra-selected-unit').each(function () {
			const id = parseInt(jQuery(this).attr('data-village-id'));
			const unit = jQuery(this).attr('data-unit-type');
			const coords = jQuery(this).attr('data-village-coords');
			const isPrioVillage = jQuery(this).parent().parent().find('td .ra-priority-village')[0] ? true : false;

			const distance = calculateDistance(coords, destinationVillage);

			villagesUnitsToSend.push({
				id: id,
				unit: unit,
				coords: coords,
				highPrio: isPrioVillage,
				distance: distance,
			});
		});

		if (villagesUnitsToSend.length > 0 && landingTimeString !== '') {
			UI.SuccessMessage(tt('Launch times are being calculated ...'));
			const landingTime = getLandingTime(landingTimeString);
			const plans = getPlans(landingTime, destinationVillage, villagesUnitsToSend);

			if (plans.length > 0) {
				const planBBCode = getBBCodePlans(plans, destinationVillage);
				jQuery('#raVillagePlanner').show();
				jQuery('#raExportPlanBBCode').val(planBBCode);
			} else {
				UI.ErrorMessage(tt('No possible combinations found!'));
				jQuery('#raVillagePlanner').hide();
				jQuery('#raExportPlanBBCode').val('');
			}
		} else {
			UI.ErrorMessage(tt('Missing user input!'));
		}
	});
}

// Action Handler: Reset all user input
function resetAll() {
	jQuery('#resetAll').on('click', function (e) {
		e.preventDefault();
		initAttackPlanner(GROUP_ID);
	});
}

// Action Handler: When a command is clicked fill landing time with the landing time of the command
function fillLandingTimeFromCommand() {
	jQuery('#commands_outgoings table tbody tr.command-row, #commands_incomings table tbody tr.command-row').on(
		'click',
		function () {
			jQuery('#commands_outgoings table tbody tr.command-row').removeClass('ra-chosen-command');
			jQuery(this).addClass('ra-chosen-command');

			const commandLandingTime = parseInt(jQuery(this).find('td:eq(2) span').attr('data-endtime')) * 1000;

			const landingTimeDateTime = new Date(commandLandingTime);
			const serverDateTime = getServerTime();
			const localDateTime = new Date();

			const diffTime = Math.abs(localDateTime - serverDateTime);
			const newLandingTime = Math.ceil(Math.abs(landingTimeDateTime - diffTime));
			const newLandingTimeObj = new Date(newLandingTime);
			const formattedNewLandingTime = formatDateTime(newLandingTimeObj);

			jQuery('#raLandingTime').val(formattedNewLandingTime);
			UI.SuccessMessage(tt('Landing time was updated!'));
		}
	);
}

// Action Handler: Filter villages shown by selected group
function filterVillagesByChosenGroup() {
	jQuery('#raGroupsFilter').on('change', function (e) {
		e.preventDefault();
		initAttackPlanner(e.target.value);
		localStorage.setItem(`${LS_PREFIX}_chosen_group`, e.target.value);
	});
}

// Action Handler: Set all villages to unit
function setAllUnits() {
	jQuery('#raAttackPlannerTable thead tr th.ra-unit-toggle').on('click', function () {
		const chosenUnit = jQuery(this).find('img').attr('data-set-unit');
		jQuery('#raAttackPlannerTable tbody tr').each(function () {
			jQuery(this).find(`img[data-unit-type="${chosenUnit}"`).trigger('click');
		});
	});
}

// Prepare plans based on user input
function getPlans(landingTime, destinationVillage, villagesUnitsToSend) {
	let plans = [];

	// Prepare plans list
	villagesUnitsToSend.forEach((item) => {
		const launchTime = getLaunchTime(item.unit, landingTime, item.distance);
		const plan = {
			destination: destinationVillage,
			landingTime: landingTime,
			distance: item.distance,
			unit: item.unit,
			highPrio: item.highPrio,
			villageId: item.id,
			launchTime: launchTime,
			coords: item.coords,
			launchTimeFormatted: formatDateTime(launchTime),
		};
		plans.push(plan);
	});

	// Sort times array by nearest launch time
	plans.sort((a, b) => {
		return a.launchTime - b.launchTime;
	});

	console.debug('plans', plans);

	// Filter only valid launch times
	const filteredPlans = plans.filter((item) => {
		return item.launchTime >= getServerTime().getTime();
	});

	console.debug('filteredPlans', filteredPlans);

	return filteredPlans;
}

// Export plan as BB Code
function getBBCodePlans(plans, destinationVillage) {
	const landingTime = jQuery('#raLandingTime').val().trim();

	let bbCode = `[size=12][b]${tt('Plan for:')}[/b] ${destinationVillage}\n[b]${tt(
		'Landing Time:'
	)}[/b] ${landingTime}[/size]\n\n`;
	bbCode += `\n`;

	plans.forEach((plan) => {
		const { unit, highPrio, coords, villageId, launchTimeFormatted } = plan;

		const [toX, toY] = destinationVillage.split('|');

		const priority = highPrio ? tt('Early send') : '';

		let commandUrl = '';

		if (game_data.player.sitter > 0) {
			commandUrl = `/game.php?t=${game_data.player.id}&village=${villageId}&screen=place&x=${toX}&y=${toY}`;
		} else {
			commandUrl = `/game.php?village=${villageId}&screen=place&x=${toX}&y=${toY}`;
		}

		bbCode += `[unit]${unit}[/unit] ${coords} [b][color=#ff0000]${priority}[/color][/b]${launchTimeFormatted}[url=${
			window.location.origin
		}${commandUrl}]${tt(' - Send')}[/url]\n`;
	});

	bbCode += `\n`;
	return bbCode;
}

// Helper: Calculate distance between 2 villages
function calculateDistance(villageA, villageB) {
	const x1 = villageA.split('|')[0];
	const y1 = villageA.split('|')[1];

	const x2 = villageB.split('|')[0];
	const y2 = villageB.split('|')[1];

	const deltaX = Math.abs(x1 - x2);
	const deltaY = Math.abs(y1 - y2);

	const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

	return distance;
}

// Helper: Get launch time of command
function getLaunchTime(unit, landingTime, distance) {
	const msPerSec = 1000;
	const secsPerMin = 60;
	const msPerMin = msPerSec * secsPerMin;

	const unitSpeed = unitInfo.config[unit].speed;
	const unitTime = distance * unitSpeed * msPerMin;

	const launchTime = new Date();
	launchTime.setTime(Math.round((landingTime - unitTime) / msPerSec) * msPerSec);

	return launchTime.getTime();
}

// Helper: Get server time
function getServerTime() {
	const serverTime = jQuery('#serverTime').text();
	const serverDate = jQuery('#serverDate').text();

	const [day, month, year] = serverDate.split('/');
	const serverTimeFormatted = year + '-' + month + '-' + day + ' ' + serverTime;
	const serverTimeObject = new Date(serverTimeFormatted);

	return serverTimeObject;
}

// Helper: Format date
function formatDateTime(date) {
	let currentDateTime = new Date(date);

	var currentYear = currentDateTime.getFullYear();
	var currentMonth = currentDateTime.getMonth();
	var currentDate = currentDateTime.getDate();
	var currentHours = '' + currentDateTime.getHours();
	var currentMinutes = '' + currentDateTime.getMinutes();
	var currentSeconds = '' + currentDateTime.getSeconds();

	currentMonth = currentMonth + 1;
	currentMonth = '' + currentMonth;
	currentMonth = currentMonth.padStart(2, '0');

	currentHours = currentHours.padStart(2, '0');
	currentMinutes = currentMinutes.padStart(2, '0');
	currentSeconds = currentSeconds.padStart(2, '0');

	let formatted_date =
		currentDate +
		'/' +
		currentMonth +
		'/' +
		currentYear +
		' ' +
		currentHours +
		':' +
		currentMinutes +
		':' +
		currentSeconds;

	return formatted_date;
}

// Helper: Get landing time date object
function getLandingTime(landingTime) {
	const [landingDay, landingHour] = landingTime.split(' ');
	const [day, month, year] = landingDay.split('/');
	const landingTimeFormatted = year + '-' + month + '-' + day + ' ' + landingHour;
	const landingTimeObject = new Date(landingTimeFormatted);
	return landingTimeObject;
}

// Helper: Render own villages table
function renderVillagesTable(villages) {
	if (villages.length) {
		const destinationVillage = jQuery('#content_value table table td:eq(2)').text();

		let villagesTable = `
		<table id="raAttackPlannerTable" class="ra-table" width="100%">
			<thead>
				<tr>
					<th class="ra-text-left" width="25%">
						${tt('Village')} (${villages.length})
					</th>
					<th class="5%">
						${tt('Dist.')}
					</th>
					<th width="5%">
						${tt('Prio.')}
					</th>
					<th class="ra-unit-toggle">
						<img src="/graphic/unit/unit_spear.png" data-set-unit="spear">
					</th>
					<th class="ra-unit-toggle">
						<img src="/graphic/unit/unit_sword.png" data-set-unit="sword">
					</th>
					<th class="ra-unit-toggle">
						<img src="/graphic/unit/unit_axe.png" data-set-unit="axe">
					</th>
					<th class="archer-world ra-unit-toggle">
						<img src="/graphic/unit/unit_archer.png" data-set-unit="archer">
					</th>
					<th class="ra-unit-toggle">
						<img src="/graphic/unit/unit_spy.png" data-set-unit="spy">
					</th>
					<th class="ra-unit-toggle">
						<img src="/graphic/unit/unit_light.png" data-set-unit="light">
					</th>
					<th class="archer-world ra-unit-toggle">
						<img src="/graphic/unit/unit_marcher.png" data-set-unit="marcher">
					</th>
					<th class="ra-unit-toggle">
						<img src="/graphic/unit/unit_heavy.png" data-set-unit="heavy">
					</th>
					<th class="ra-unit-toggle">
						<img src="/graphic/unit/unit_ram.png" data-set-unit="ram">
					</th>
					<th class="ra-unit-toggle">
						<img src="/graphic/unit/unit_catapult.png" data-set-unit="catapult">
					</th>
					<th class="paladin-world ra-unit-toggle">
						<img src="/graphic/unit/unit_knight.png" data-set-unit="knight">
					</th>
					<th class="ra-unit-toggle">
						<img src="/graphic/unit/unit_snob.png" data-set-unit="snob">
					</th>
				</tr>
			</thead>
			<tbody>
	`;

		const villageCombinations = [];
		villages.forEach((village) => {
			troopCounts.forEach((villageTroops) => {
				if (villageTroops.villageId === village.id) {
					villageCombinations.push({
						...village,
						...villageTroops,
					});
				}
			});
		});

		villageCombinations.forEach((village) => {
			const {
				name,
				coords,
				id,
				spear,
				sword,
				axe,
				archer,
				spy,
				light,
				marcher,
				heavy,
				ram,
				catapult,
				knight,
				snob,
			} = village;
			const continent = getContinentByCoord(coords);
			const distance = calculateDistance(coords, destinationVillage);
			const link = game_data.link_base_pure + `info_village&id=${id}`;

			villagesTable += `
			<tr>
				<td class="ra-text-left" width="25%">
					<a href="${link}" target="_blank" rel="noopener noreferrer">
						${name} (${coords}) K${continent}
					</a>
				</td>
				<td width="5%">
					${parseFloat(distance).toFixed(2)}
				</td>
				<td width="5%">
					<span class="icon header favorite_add"></span>
				</td>
				<td>
					<img data-unit-type="spear" data-village-id="${id}" data-village-coords="${coords}" src="/graphic/unit/unit_spear.png">
					<span>${formatAsNumber(spear)}</span>
				</td>
				<td>
					<img data-unit-type="sword" data-village-id="${id}" data-village-coords="${coords}" src="/graphic/unit/unit_sword.png">
					<span>${formatAsNumber(sword)}</span>
				</td>
				<td>
					<img data-unit-type="axe" data-village-id="${id}" data-village-coords="${coords}" src="/graphic/unit/unit_axe.png">
					<span>${formatAsNumber(axe)}</span>
				</td>
				<td class="archer-world">
					<img data-unit-type="archer" data-village-id="${id}" data-village-coords="${coords}" src="/graphic/unit/unit_archer.png">
					<span>${formatAsNumber(archer)}</span>
				</td>
				<td>
					<img data-unit-type="spy" data-village-id="${id}" data-village-coords="${coords}" src="/graphic/unit/unit_spy.png">
					<span>${formatAsNumber(spy)}</span>
				</td>
				<td>
					<img data-unit-type="light" data-village-id="${id}" data-village-coords="${coords}" src="/graphic/unit/unit_light.png">
					<span>${formatAsNumber(light)}</span>
				</td>
				<td class="archer-world">
					<img data-unit-type="marcher" data-village-id="${id}" data-village-coords="${coords}" src="/graphic/unit/unit_marcher.png">
					<span>${formatAsNumber(marcher)}</span>
				</td>
				<td>
					<img data-unit-type="heavy" data-village-id="${id}" data-village-coords="${coords}" src="/graphic/unit/unit_heavy.png">
					<span>${formatAsNumber(heavy)}</span>
				</td>
				<td>
					<img data-unit-type="ram" data-village-id="${id}" data-village-coords="${coords}" src="/graphic/unit/unit_ram.png">
					<span>${formatAsNumber(ram)}</span>
				</td>
				<td>
					<img data-unit-type="catapult" data-village-id="${id}" data-village-coords="${coords}" src="/graphic/unit/unit_catapult.png">
					<span>${formatAsNumber(catapult)}</span>
				</td>
				<td class="paladin-world">
					<img data-unit-type="knight" data-village-id="${id}" data-village-coords="${coords}" src="/graphic/unit/unit_knight.png">
					<span>${formatAsNumber(knight)}</span>
				</td>
				<td>
					<img data-unit-type="snob" data-village-id="${id}" data-village-coords="${coords}" src="/graphic/unit/unit_snob.png">
					<span>${formatAsNumber(snob)}</span>
				</td>
			</tr>
		`;
		});

		villagesTable += `
			</tbody>
		</table>
	`;

		return villagesTable;
	} else {
		return `<p><b>${tt('Villages list could not be fetched!')}</b><br></p>`;
	}
}

// Helper: Render groups filter
function renderGroupsFilter(groups) {
	const groupId = localStorage.getItem(`${LS_PREFIX}_chosen_group`);
	let groupsFilter = `
		<select name="ra_groups_filter" id="raGroupsFilter">
	`;

	for (const [_, group] of Object.entries(groups.result)) {
		const { group_id, name } = group;
		const isSelected = parseInt(group_id) === parseInt(groupId) ? 'selected' : '';
		if (name !== undefined) {
			groupsFilter += `
				<option value="${group_id}" ${isSelected}>
					${name}
				</option>
			`;
		}
	}

	groupsFilter += `
		</select>
	`;

	return groupsFilter;
}

// Helper: Process coordinate and extract coordinate continent
function getContinentByCoord(coord) {
	if (!coord) return '';
	const coordParts = coord.split('|');
	return coordParts[1].charAt(0) + coordParts[0].charAt(0);
}

// Helper: Fetch player villages by group
async function fetchAllPlayerVillagesByGroup(groupId) {
	let villagesByGroup = [];

	try {
		const url = game_data.link_base_pure + 'groups&ajax=load_villages_from_group';
		villagesByGroup = await jQuery
			.post({
				url: url,
				data: { group_id: groupId },
			})
			.then((response) => {
				const parser = new DOMParser();
				const htmlDoc = parser.parseFromString(response.html, 'text/html');
				const tableRows = jQuery(htmlDoc).find('#group_table > tbody > tr').not(':eq(0)');

				let villagesList = [];

				tableRows.each(function () {
					const villageId = parseInt(
						jQuery(this).find('td:eq(0) a').attr('href').split('(')[1].split(',')[0]
					);
					const villageName = jQuery(this).find('td:eq(0)').text().trim();
					const villageCoords = jQuery(this).find('td:eq(1)').text().trim();

					villagesList.push({
						id: villageId,
						name: villageName,
						coords: villageCoords,
					});
				});

				return villagesList;
			})
			.catch((error) => {
				UI.ErrorMessage(tt('Villages list could not be fetched!'));
				return [];
			});
	} catch (error) {
		console.error(`${scriptInfo()} Error:`, error);
		UI.ErrorMessage(tt('Villages list could not be fetched!'));
		return [];
	}

	return villagesByGroup;
}

// Helper: Fetch village groups
async function fetchVillageGroups() {
	const villageGroups = await jQuery
		.get(game_data.link_base_pure + 'groups&mode=overview&ajax=load_group_menu')
		.then((response) => response)
		.catch((error) => {
			UI.ErrorMessage('Error fetching village groups!');
			console.error(`${scriptInfo()} Error:`, error);
		});

	return villageGroups;
}

// Helper: Fetch World Unit Info
function fetchUnitInfo() {
	jQuery
		.ajax({
			url: '/interface.php?func=get_unit_info',
		})
		.done(function (response) {
			unitInfo = xml2json($(response));
			localStorage.setItem(`${LS_PREFIX}_unit_info`, JSON.stringify(unitInfo));
			localStorage.setItem(`${LS_PREFIX}_last_updated`, Date.parse(new Date()));
		});
}

// Helper: Fetch home troop counts for current group
async function fetchTroopsForCurrentGroup() {
	const groupId = jQuery('.ra-group-filter.btn-confirm-yes').attr('data-group-id');
	const troopsForGroup = await jQuery
		.get(game_data.link_base_pure + `overview_villages&mode=combined&group=${groupId}&`)
		.then((response) => {
			const htmlDoc = jQuery.parseHTML(response);
			const combinedTableRows = jQuery(htmlDoc).find('#combined_table tr.nowrap');
			const combinedTableHead = jQuery(htmlDoc).find('#combined_table tr:eq(0) th');

			const homeTroops = [];
			const combinedTableHeader = [];

			// collect possible buildings and troop types
			jQuery(combinedTableHead).each(function () {
				const thImage = jQuery(this).find('img').attr('src');
				if (thImage) {
					let thImageFilename = thImage.split('/').pop();
					thImageFilename = thImageFilename.replace('.png', '');
					combinedTableHeader.push(thImageFilename);
				} else {
					combinedTableHeader.push(null);
				}
			});

			// collect possible troop types
			combinedTableRows.each(function () {
				let rowTroops = {};

				combinedTableHeader.forEach((tableHeader, index) => {
					if (tableHeader) {
						if (tableHeader.includes('unit_')) {
							const villageId = jQuery(this).find('td:eq(1) span.quickedit-vn').attr('data-id');
							const unitType = tableHeader.replace('unit_', '');
							rowTroops = {
								...rowTroops,
								villageId: parseInt(villageId),
								[unitType]: parseInt(jQuery(this).find(`td:eq(${index})`).text()),
							};
						}
					}
				});

				homeTroops.push(rowTroops);
			});

			return homeTroops;
		})
		.catch((error) => {
			UI.ErrorMessage(tt('An error occured while fetching troop counts!'));
			console.error(`${scriptInfo()} Error:`, error);
		});

	return troopsForGroup;
}

// Helper: XML to JSON converter
var xml2json = function ($xml) {
	var data = {};
	$.each($xml.children(), function (i) {
		var $this = $(this);
		if ($this.children().length > 0) {
			data[$this.prop('tagName')] = xml2json($this);
		} else {
			data[$this.prop('tagName')] = $.trim($this.text());
		}
	});
	return data;
};

// Helper: Format as number
function formatAsNumber(number) {
	return parseInt(number).toLocaleString('de');
}

// Helper: Get parameter by name
function getParameterByName(name, url = window.location.href) {
	return new URL(url).searchParams.get(name);
}

// Helper: Generates script info
function scriptInfo() {
	return `[${scriptData.name} ${scriptData.version}]`;
}

// Helper: Prints universal debug information
function initDebug() {
	console.debug(`${scriptInfo()} It works ðŸš€!`);
	console.debug(`${scriptInfo()} HELP:`, scriptData.helpLink);
	if (DEBUG) {
		console.debug(`${scriptInfo()} Market:`, game_data.market);
		console.debug(`${scriptInfo()} World:`, game_data.world);
		console.debug(`${scriptInfo()} Screen:`, game_data.screen);
		console.debug(`${scriptInfo()} Game Version:`, game_data.majorVersion);
		console.debug(`${scriptInfo()} Game Build:`, game_data.version);
		console.debug(`${scriptInfo()} Locale:`, game_data.locale);
		console.debug(`${scriptInfo()} Premium:`, game_data.features.Premium.active);
	}
}

// Helper: Text Translator
function tt(string) {
	var gameLocale = game_data.locale;

	if (translations[gameLocale] !== undefined) {
		return translations[gameLocale][string];
	} else {
		return translations['en_DK'][string];
	}
}

// Helper: Translations Notice
function initTranslationsNotice() {
	const gameLocale = game_data.locale;

	if (translations[gameLocale] === undefined) {
		UI.ErrorMessage(
			`No translation found for <b>${gameLocale}</b>. <a href="${scriptData.helpLink}" class="btn" target="_blank" rel="noreferrer noopener">Add Yours</a> by replying to the thread.`,
			4000
		);
	}
}

// Initialize Script
(function () {
	const gameScreen = getParameterByName('screen');
	if (gameScreen === 'info_village') {
		initAttackPlanner(GROUP_ID);
	} else {
		UI.ErrorMessage(tt('This script can only be run on a single village screen!'));
	}
})();
