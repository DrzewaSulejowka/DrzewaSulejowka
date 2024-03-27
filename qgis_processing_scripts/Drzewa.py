"""
Model exported as python.
Name : Przetwarzanie koron drzew
Group : 
With QGIS : 33401
"""

from qgis.core import QgsProcessing
from qgis.core import QgsProcessingAlgorithm
from qgis.core import QgsProcessingMultiStepFeedback
from qgis.core import QgsProcessingParameterVectorLayer
from qgis.core import QgsProcessingParameterNumber
from qgis.core import QgsProcessingParameterField
from qgis.core import QgsProcessingParameterFeatureSource
from qgis.core import QgsProcessingParameterRasterLayer
from qgis.core import QgsProcessingParameterFeatureSink
from qgis.core import QgsProperty
import processing


class PrzetwarzanieKoronDrzew(QgsProcessingAlgorithm):

    def initAlgorithm(self, config=None):
        self.addParameter(QgsProcessingParameterVectorLayer('poligony_koron_drzew', 'Poligony koron drzew', types=[QgsProcessing.TypeVectorPolygon], defaultValue=None))
        self.addParameter(QgsProcessingParameterVectorLayer('warstwa_maski_granic_miasta', 'Warstwa maski (granic miasta)', types=[QgsProcessing.TypeVectorPolygon], defaultValue=None))
        self.addParameter(QgsProcessingParameterRasterLayer('nmt', 'NMT', optional=True, defaultValue=None))
        self.addParameter(QgsProcessingParameterNumber('minimalna_wysoko_drzewa', 'Minimalna wysokość drzewa (m)', optional=True, type=QgsProcessingParameterNumber.Integer, minValue=1, maxValue=50, defaultValue=5))
        self.addParameter(QgsProcessingParameterNumber('minimalna_powierzchnia_korony_drzewa', 'Minimalna powierzchnia korony drzewa (m2)', optional=True, type=QgsProcessingParameterNumber.Integer, minValue=1, maxValue=50, defaultValue=3))
        self.addParameter(QgsProcessingParameterVectorLayer('bdot10k_wody_powierzchniowe', 'BDOT10k wody powierzchniowe', optional=True, types=[QgsProcessing.TypeVectorPolygon], defaultValue=None))
        self.addParameter(QgsProcessingParameterVectorLayer('bdot10k_budynki', 'BDOT10k budynki', optional=True, types=[QgsProcessing.TypeVectorPolygon], defaultValue=None))
        self.addParameter(QgsProcessingParameterVectorLayer('bdot10k_jezdnie', 'BDOT10k jezdnie', optional=True, types=[QgsProcessing.TypeVectorLine], defaultValue=None))
        self.addParameter(QgsProcessingParameterField('atrybut_szerokoci_jezdni', 'Atrybut szerokości jezdni', optional=True, type=QgsProcessingParameterField.Numeric, parentLayerParameterName='bdot10k_jezdnie', allowMultiple=False, defaultValue='SZERNAWIE'))
        self.addParameter(QgsProcessingParameterFeatureSource('bdot10k_tereny_miejskie', 'BDOT10k tereny miejskie', optional=True, types=[QgsProcessing.TypeVectorPolygon], defaultValue=None))
        self.addParameter(QgsProcessingParameterVectorLayer('bdot10k_lasy', 'BDOT10k lasy', optional=True, types=[QgsProcessing.TypeVectorPolygon], defaultValue=None))
        self.addParameter(QgsProcessingParameterVectorLayer('cenny_ukad_przestrzenny', 'Cenny układ przestrzenny', optional=True, types=[QgsProcessing.TypeVectorPolygon], defaultValue=None))
        self.addParameter(QgsProcessingParameterVectorLayer('dzialki_ewidencyjne', 'Działki ewidencyjne', optional=True, types=[QgsProcessing.TypeVectorPolygon], defaultValue=None))
        # Raster powinien być GeoTIFFem o wartościach piksela 0 i 1, gdzie 0 oznacza drzewa iglaste, a 1 drzewa liściaste.
        self.addParameter(QgsProcessingParameterRasterLayer('raster_z_klasami_drzewa', 'Raster z klasami drzewa', optional=True, defaultValue=None))
        self.addParameter(QgsProcessingParameterFeatureSink('warstwa_punktowa_drzew', 'Warstwa punktowa drzew', type=QgsProcessing.TypeVectorAnyGeometry, createByDefault=True, supportsAppend=True, defaultValue=None))
        self.addParameter(QgsProcessingParameterVectorLayer('pomniki_przyrody', 'Pomniki przyrody', optional=True, types=[QgsProcessing.TypeVectorPoint], defaultValue=None))

    
    def processAlgorithm(self, parameters, context, model_feedback):
        # Use a multi-step feedback, so that individual child algorithm progress reports are adjusted for the
        # overall progress through the model
        feedback = QgsProcessingMultiStepFeedback(39, model_feedback)
        results = {}
        outputs = {}

        # Zaznacz drzewa w obrębie miasta
        alg_params = {
            'INPUT': parameters['poligony_koron_drzew'],
            'INTERSECT': parameters['warstwa_maski_granic_miasta'],
            'METHOD': 0,  # utworzenie nowej selekcji
            'PREDICATE': [0],  # przecinają się
        }
        outputs['ZaznaczDrzewaWObrebieMiasta'] = processing.run('native:selectbylocation', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(1)
        if feedback.isCanceled():
            return {}

        # Twórz indeks przestrzenny koron
        alg_params = {
            'INPUT': parameters['poligony_koron_drzew']
        }
        outputs['TworzIndeksPrzestrzennyKoron'] = processing.run('native:createspatialindex', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(2)
        if feedback.isCanceled():
            return {}

        # Znajdź drzewa o koronie większej niż 3m2
        alg_params = {
            'FIELD': 'convhull_area',
            'INPUT': parameters['poligony_koron_drzew'],
            'METHOD': 2,  # usunięcie z bieżącej selekcji
            'OPERATOR': 4,  # <
            'VALUE': parameters['minimalna_powierzchnia_korony_drzewa']
        }
        outputs['ZnajdzDrzewaOKoronieWiekszejNiz3m2'] = processing.run('qgis:selectbyattribute', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(3)
        if feedback.isCanceled():
            return {}

        # Wyodrębnij drzewa w mieście
        alg_params = {
            'INPUT': outputs['TworzIndeksPrzestrzennyKoron']['OUTPUT'],
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['WyodrebnijDrzewaWMiescie'] = processing.run('native:saveselectedfeatures', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(4)
        if feedback.isCanceled():
            return {}
        
        # Wyodrębnij drzewa w mieście - indeks przestrzenny
        alg_params = {
            'INPUT': outputs['WyodrebnijDrzewaWMiescie']['OUTPUT']
        }
        outputs['WyodrebnijDrzewaWMiescie_IP'] = processing.run('native:createspatialindex', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(5)
        if feedback.isCanceled():
            return {}


        if parameters['pomniki_przyrody'] is not None:

            # Twórz indeks przestrzenny pomnikom przyrody
            alg_params = {
                'INPUT': parameters['pomniki_przyrody']
            }
            outputs['TworzIndeksPrzestrzennyPomnikomPrzyrody'] = processing.run('native:createspatialindex', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(5)
            if feedback.isCanceled():
                return {}
            
            # Zaznaczenie przez lokalizację
            alg_params = {
                'INPUT': outputs['WyodrebnijDrzewaWMiescie_IP']['OUTPUT'],
                'INTERSECT': outputs['TworzIndeksPrzestrzennyPomnikomPrzyrody']['OUTPUT'],
                'METHOD': 0,  # utworzenie nowej selekcji
                'PREDICATE': [0],  # przecinają się
            }
            outputs['ZaznaczeniePrzezLokalizacje'] = processing.run('native:selectbylocation', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(6)
            if feedback.isCanceled():
                return {}

            # Kalkulator pól
            alg_params = {
                'FIELD_LENGTH': 1,
                'FIELD_NAME': 'pomnik_przyrody',
                'FIELD_PRECISION': 0,
                'FIELD_TYPE': 6,  # Boolean
                'FORMULA': 'if (is_selected(), True, False)',
                'INPUT': outputs['WyodrebnijDrzewaWMiescie_IP']['OUTPUT'],
                'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
            }
            outputs['KalkulatorPol'] = processing.run('native:fieldcalculator', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(7)
            if feedback.isCanceled():
                return {}


    

        # Centroidy
        alg_params = {
            'ALL_PARTS': False,
            'INPUT': outputs['KalkulatorPol']['OUTPUT'] if 'KalkulatorPol' in outputs else outputs['WyodrebnijDrzewaWMiescie_IP']['OUTPUT'],
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['Centroidy'] = processing.run('native:centroids', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(8)
        if feedback.isCanceled():
            return {}
        
        # Twórz indeks przestrzenny centroidom
        alg_params = {
            'INPUT': outputs['Centroidy']['OUTPUT'],
        }
        outputs['Centroidy_IP'] = processing.run('native:createspatialindex', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(9)
        if feedback.isCanceled():
            return {}
        

        if parameters['bdot10k_wody_powierzchniowe'] is not None:
            
            # Twórz indeks przestrzenny wodom powierzchniowym
            alg_params = {
                'INPUT': parameters['bdot10k_wody_powierzchniowe']
            }
            outputs['TworzIndeksPrzestrzennyWodomPowierzchniowym'] = processing.run('native:createspatialindex', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(10)
            if feedback.isCanceled():
                return {}
            
            # Zaznacz drzewa na wodzie
            alg_params = {
                'INPUT': outputs['Centroidy_IP']['OUTPUT'],
                'INTERSECT': outputs['TworzIndeksPrzestrzennyWodomPowierzchniowym']['OUTPUT'],
                'METHOD': 0,  # utworzenie nowej selekcji
                'PREDICATE': [2],  # są rozłączne
            }
            outputs['ZaznaczDrzewaNaWodzie'] = processing.run('native:selectbylocation', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(11)
            if feedback.isCanceled():
                return {}
            
            # Usuń drzewa poza wodami powierzchniowymi
            alg_params = {
                'INPUT': outputs['Centroidy_IP']['OUTPUT'],
                'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
            }
            outputs['UsunDrzewaPozaWodamiPowierzchniowymi'] = processing.run('native:saveselectedfeatures', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(12)
            if feedback.isCanceled():
                return {}
            
            # Twórz indeks przestrzenny drzewom poza wodami powierzchniowymni
            alg_params = {
                'INPUT': outputs['UsunDrzewaPozaWodamiPowierzchniowymi']['OUTPUT']
            }
            outputs['UsunDrzewaPozaWodamiPowierzchniowymi_IP'] = processing.run('native:createspatialindex', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(10)
            if feedback.isCanceled():
                return {}


        if parameters['bdot10k_budynki'] is not None:

            # Twórz indeks przestrzenny budynkom
            alg_params = {
                'INPUT': parameters['bdot10k_budynki']
            }
            outputs['TworzIndeksPrzestrzennyBudynkom'] = processing.run('native:createspatialindex', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(13)
            if feedback.isCanceled():
                return {}
            
            # Zaznacz drzewa na budynkach
            alg_params = {
                'INPUT': outputs['UsunDrzewaPozaWodamiPowierzchniowymi_IP']['OUTPUT'] if 'UsunDrzewaPozaWodamiPowierzchniowymi_IP' in outputs \
                    else outputs['Centroidy_IP']['OUTPUT'],
                'INTERSECT': outputs['TworzIndeksPrzestrzennyBudynkom']['OUTPUT'],
                'METHOD': 0,  # utworzenie nowej selekcji
                'PREDICATE': [2],  # są rozłączne
            }
            outputs['ZaznaczDrzewaNaBudynkach'] = processing.run('native:selectbylocation', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(14)
            if feedback.isCanceled():
                return {}
            
            # Usuń drzewa na budynkach
            alg_params = {
                'INPUT': outputs['UsunDrzewaPozaWodamiPowierzchniowymi_IP']['OUTPUT'] if 'UsunDrzewaPozaWodamiPowierzchniowymi_IP' in outputs \
                    else outputs['Centroidy_IP']['OUTPUT'],
                'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
            }
            outputs['UsunDrzewaNaBudynkach'] = processing.run('native:saveselectedfeatures', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(15)
            if feedback.isCanceled():
                return {}
            
            # Twórz indeks przestrzenny drzewom poza budynkami
            alg_params = {
                'INPUT': outputs['UsunDrzewaNaBudynkach']['OUTPUT']
            }
            outputs['UsunDrzewaNaBudynkach_IP'] = processing.run('native:createspatialindex', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(13)
            if feedback.isCanceled():
                return {}


        if parameters['nmt'] is not None:

            # Próbkuj NMT
            alg_params = {
                'COLUMN_PREFIX': 'NMT_Z',
                'INPUT': outputs['UsunDrzewaNaBudynkach_IP']['OUTPUT'] if 'UsunDrzewaNaBudynkach_IP' in outputs \
                    else outputs['UsunDrzewaPozaWodamiPowierzchniowymi_IP']['OUTPUT'] if 'UsunDrzewaPozaWodamiPowierzchniowymi_IP' in outputs \
                    else outputs['Centroidy_IP']['OUTPUT'],
                'RASTERCOPY': parameters['nmt'],
                'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
            }
            outputs['ProbkujNmt'] = processing.run('native:rastersampling', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(16)
            if feedback.isCanceled():
                return {}

            # Oblicz wysokość drzewa
            alg_params = {
                'FIELD_LENGTH': 6,
                'FIELD_NAME': 'h',
                'FIELD_PRECISION': 2,
                'FIELD_TYPE': 0,  # Decimal (double)
                'FORMULA': '"Z" - "NMT_Z1"',
                'INPUT': outputs['ProbkujNmt']['OUTPUT'],
                'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
            }
            outputs['ObliczWysokoscDrzewa'] = processing.run('native:fieldcalculator', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(17)
            if feedback.isCanceled():
                return {}

            # Wyodrębnij drzewa wyższe niż
            alg_params = {
                'FIELD': 'h',
                'INPUT': outputs['ObliczWysokoscDrzewa']['OUTPUT'],
                'OPERATOR': 2,  # >
                'VALUE': parameters['minimalna_wysoko_drzewa'],
                'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
            }
            outputs['WyodrebnijDrzewaWyzszeNiz'] = processing.run('native:extractbyattribute', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(18)
            if feedback.isCanceled():
                return {}
            
            # Usuń pole wysokości npm
            alg_params = {
                'COLUMN': ['NMT_Z1'],
                'INPUT': outputs['WyodrebnijDrzewaWyzszeNiz']['OUTPUT'],
                'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
            }
            outputs['UsunPoleWysokosciNpm'] = processing.run('native:deletecolumn', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(19)
            if feedback.isCanceled():
                return {}


        # Zmień nazwę pola powierzchni
        alg_params = {
            'FIELD': 'convhull_area',
            'INPUT': outputs['UsunPoleWysokosciNpm']['OUTPUT'] if 'UsunPoleWysokosciNpm' in outputs \
                else outputs['UsunDrzewaNaBudynkach_IP']['OUTPUT'] if 'UsunDrzewaNaBudynkach_IP' in outputs \
                else outputs['UsunDrzewaPozaWodamiPowierzchniowymi_IP']['OUTPUT'] if 'UsunDrzewaPozaWodamiPowierzchniowymi_IP' in outputs \
                else outputs['Centroidy_IP']['OUTPUT'],
            'NEW_NAME': 'area_m2',
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['ZmienNazwePolaPowierzchni'] = processing.run('native:renametablefield', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(20)
        if feedback.isCanceled():
            return {}

        
        # Usuń pole max wysokości
        alg_params = {
            'COLUMN': ['Z'],
            'INPUT': outputs['ZmienNazwePolaPowierzchni']['OUTPUT'],
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['UsunPoleMaxWysokosci'] = processing.run('native:deletecolumn', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(21)
        if feedback.isCanceled():
            return {}
        
        # Usuń pole max wysokości - indeks przestrzenny
        alg_params = {
            'INPUT': outputs['UsunPoleMaxWysokosci']['OUTPUT']
        }
        outputs['UsunPoleMaxWysokosci_IP'] = processing.run('native:createspatialindex', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(22)
        if feedback.isCanceled():
            return {}
        

        if parameters['bdot10k_jezdnie'] is not None:

            # Twórz indeks przestrzenny dla jezdni
            alg_params = {
                'INPUT': parameters['bdot10k_jezdnie']
            }
            outputs['TworzIndeksPrzestrzennyDlaJezdni'] = processing.run('native:createspatialindex', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(22)
            if feedback.isCanceled():
                return {}
            
            # Otoczka
            alg_params = {
                'DISSOLVE': True,
                'DISTANCE': QgsProperty.fromExpression('"SZERJEZD" + 2'),
                'END_CAP_STYLE': 0,  # zaokrąglony
                'INPUT': outputs['TworzIndeksPrzestrzennyDlaJezdni']['OUTPUT'],
                'JOIN_STYLE': 0,  # zaokrąglony
                'MITER_LIMIT': 2,
                'SEGMENTS': 5,
                'SEPARATE_DISJOINT': False,
                'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
            }
            outputs['Otoczka'] = processing.run('native:buffer', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(23)
            if feedback.isCanceled():
                return {}
            
            # Twórz indeks przestrzenny otoczce
            alg_params = {
                'INPUT': outputs['Otoczka']['OUTPUT']
            }
            outputs['Otoczka_IP'] = processing.run('native:createspatialindex', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(22)
            if feedback.isCanceled():
                return {}
            
            # Zaznaczenie nasadzeń ulicznych
            alg_params = {
                'INPUT': outputs['UsunPoleMaxWysokosci_IP']['OUTPUT'],
                'INTERSECT': outputs['Otoczka_IP']['OUTPUT'],
                'METHOD': 0,  # utworzenie nowej selekcji
                'PREDICATE': [0],  # przecinają się
            }
            outputs['ZaznaczenieNasadzenUlicznych'] = processing.run('native:selectbylocation', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(24)
            if feedback.isCanceled():
                return {}
            
            # Znajdź nasadzenia uliczne
            alg_params = {
                'FIELD_LENGTH': 1,
                'FIELD_NAME': 'nasadz_ulicz',
                'FIELD_PRECISION': 0,
                'FIELD_TYPE': 6,  # Boolean
                'FORMULA': 'IF (is_selected(), True, False)',
                'INPUT': outputs['UsunPoleMaxWysokosci_IP']['OUTPUT'],
                'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
            }
            outputs['ZnajdzNasadzeniaUliczne'] = processing.run('native:fieldcalculator', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(25)
            if feedback.isCanceled():
                return {}
            
            # Znajdź nasadzenia uliczne - indeks przestrzenny
            alg_params = {
                'INPUT': outputs['ZnajdzNasadzeniaUliczne']['OUTPUT']
            }
            outputs['ZnajdzNasadzeniaUliczne_IP'] = processing.run('native:createspatialindex', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(26)
            if feedback.isCanceled():
                return {}

        if parameters['bdot10k_lasy'] is not None:

            # Twórz indeks przestrzenny lasom
            alg_params = {
                'INPUT': parameters['bdot10k_lasy']
            }
            outputs['TworzIndeksPrzestrzennyLasom'] = processing.run('native:createspatialindex', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(26)
            if feedback.isCanceled():
                return {}
            
            # Zaznaczenie drzew na obszarach zalesionych
            alg_params = {
                'INPUT': outputs['ZnajdzNasadzeniaUliczne_IP']['OUTPUT'] if 'ZnajdzNasadzeniaUliczne_IP' in outputs \
                    else outputs['UsunPoleMaxWysokosci_IP']['OUTPUT'],
                'INTERSECT': outputs['TworzIndeksPrzestrzennyLasom']['OUTPUT'],
                'METHOD': 0,  # utworzenie nowej selekcji
                'PREDICATE': [0],  # przecinają się
            }
            outputs['ZaznaczenieDrzewNaObszarachZalesionych'] = processing.run('native:selectbylocation', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(27)
            if feedback.isCanceled():
                return {}

            # Znajdź drzewa na obszarach zalesionych
            alg_params = {
                'FIELD_LENGTH': 1,
                'FIELD_NAME': 'las',
                'FIELD_PRECISION': 0,
                'FIELD_TYPE': 6,  # Boolean
                'FORMULA': 'IF (is_selected(), True, False)',
                'INPUT': outputs['ZnajdzNasadzeniaUliczne_IP']['OUTPUT'] if 'ZnajdzNasadzeniaUliczne_IP' in outputs \
                    else outputs['UsunPoleMaxWysokosci_IP']['OUTPUT'],
                'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
            }
            outputs['ZnajdzDrzewaNaObszarachZalesionych'] = processing.run('native:fieldcalculator', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(28)
            if feedback.isCanceled():
                return {}
            
            # Znajdź drzewa na obszarach zalesionych - indeks przestrzenny
            alg_params = {
                'INPUT': outputs['ZnajdzDrzewaNaObszarachZalesionych']['OUTPUT']
            }
            outputs['ZnajdzDrzewaNaObszarachZalesionych_IP'] = processing.run('native:createspatialindex', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(26)
            if feedback.isCanceled():
                return {}

        if parameters['bdot10k_tereny_miejskie'] is not None:

            # Zaznaczenie drzew na obszarach miejskich
            alg_params = {
                'INPUT': outputs['ZnajdzDrzewaNaObszarachZalesionych_IP']['OUTPUT'] if 'ZnajdzDrzewaNaObszarachZalesionych_IP' in outputs \
                    else outputs['ZnajdzNasadzeniaUliczne_IP']['OUTPUT'] if 'ZnajdzNasadzeniaUliczne_IP' in outputs \
                    else outputs['UsunPoleMaxWysokosci_IP']['OUTPUT'],
                'INTERSECT': parameters['bdot10k_tereny_miejskie'],
                'METHOD': 0,  # utworzenie nowej selekcji
                'PREDICATE': [0],  # przecinają się
            }
            outputs['ZaznaczenieDrzewNaObszarachMiejskich'] = processing.run('native:selectbylocation', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(29)
            if feedback.isCanceled():
                return {}

            # Znajdź drzewa na obszarach miejskich
            alg_params = {
                'FIELD_LENGTH': 1,
                'FIELD_NAME': 'teren_miejski',
                'FIELD_PRECISION': 0,
                'FIELD_TYPE': 6,  # Boolean
                'FORMULA': 'IF (is_selected(), True, False)',
                'INPUT': outputs['ZnajdzDrzewaNaObszarachZalesionych_IP']['OUTPUT'] if 'ZnajdzDrzewaNaObszarachZalesionych_IP' in outputs \
                    else outputs['ZnajdzNasadzeniaUliczne_IP']['OUTPUT'] if 'ZnajdzNasadzeniaUliczne_IP' in outputs \
                    else outputs['UsunPoleMaxWysokosci_IP']['OUTPUT'],
                'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
            }
            outputs['ZnajdzDrzewaNaObszarachMiejskich'] = processing.run('native:fieldcalculator', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(30)
            if feedback.isCanceled():
                return {}
            
            # Znajdź drzewa na obszarach miejskich - indeks przestrzenny
            alg_params = {
                'INPUT': outputs['ZnajdzDrzewaNaObszarachMiejskich']['OUTPUT']
            }
            outputs['ZnajdzDrzewaNaObszarachMiejskich_IP'] = processing.run('native:createspatialindex', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(26)
            if feedback.isCanceled():
                return {}

        if parameters['cenny_ukad_przestrzenny'] is not None:

            # Zaznaczenie drzew kształtujących przestrzeń o cennym układzie przestrzennym
            alg_params = {
                'INPUT': outputs['ZnajdzDrzewaNaObszarachMiejskich_IP']['OUTPUT'] if 'ZnajdzDrzewaNaObszarachMiejskich_IP' in outputs \
                    else outputs['ZnajdzDrzewaNaObszarachZalesionych_IP']['OUTPUT'] if 'ZnajdzDrzewaNaObszarachZalesionych_IP' in outputs \
                    else outputs['ZnajdzNasadzeniaUliczne_IP']['OUTPUT'] if 'ZnajdzNasadzeniaUliczne_IP' in outputs \
                    else outputs['UsunPoleMaxWysokosci_IP']['OUTPUT'],
                'INTERSECT': parameters['cenny_ukad_przestrzenny'],
                'METHOD': 0,  # utworzenie nowej selekcji
                'PREDICATE': [0],  # przecinają się
            }
            outputs['ZaznaczenieDrzewKsztaltujcychPrzestrzenOCennymUkladziePrzestrzennym'] = processing.run('native:selectbylocation', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(31)
            if feedback.isCanceled():
                return {}

            # Znajdź drzewa kształtujące przestrzeń o cennym układzie przestrzennym
            alg_params = {
                'FIELD_LENGTH': 1,
                'FIELD_NAME': 'cenny_uk_przest',
                'FIELD_PRECISION': 0,
                'FIELD_TYPE': 6,  # Boolean
                'FORMULA': 'IF (is_selected(), True, False)',
                'INPUT': outputs['ZnajdzDrzewaNaObszarachMiejskich_IP']['OUTPUT'] if 'ZnajdzDrzewaNaObszarachMiejskich_IP' in outputs \
                    else outputs['ZnajdzDrzewaNaObszarachZalesionych_IP']['OUTPUT'] if 'ZnajdzDrzewaNaObszarachZalesionych_IP' in outputs \
                    else outputs['ZnajdzNasadzeniaUliczne_IP']['OUTPUT'] if 'ZnajdzNasadzeniaUliczne_IP' in outputs \
                    else outputs['UsunPoleMaxWysokosci_IP']['OUTPUT'],
                'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
            }
            outputs['ZnajdzDrzewaKsztaltujacePrzestrzenOCennymUkladziePrzestrzennym'] = processing.run('native:fieldcalculator', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(32)
            if feedback.isCanceled():
                return {}
            
            # Znajdź drzewa kształtujące przestrzeń o cennym układzie przestrzennym - indeks przestrzenny
            alg_params = {
                'INPUT': outputs['ZnajdzDrzewaKsztaltujacePrzestrzenOCennymUkladziePrzestrzennym']['OUTPUT']
            }
            outputs['ZnajdzDrzewaKsztaltujacePrzestrzenOCennymUkladziePrzestrzennym_IP'] = processing.run('native:createspatialindex', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(26)
            if feedback.isCanceled():
                return {}


        if parameters['raster_z_klasami_drzewa'] is not None:

            # Próbkuj klasy drzew
            alg_params = {
                'COLUMN_PREFIX': 'KLASA_',
                'INPUT': outputs['ZnajdzDrzewaKsztaltujacePrzestrzenOCennymUkladziePrzestrzennym_IP']['OUTPUT'] if 'ZnajdzDrzewaKsztaltujacePrzestrzenOCennymUkladziePrzestrzennym_IP' in outputs \
                    else outputs['ZnajdzDrzewaNaObszarachMiejskich_IP']['OUTPUT'] if 'ZnajdzDrzewaNaObszarachMiejskich_IP' in outputs \
                    else outputs['ZnajdzDrzewaNaObszarachZalesionych_IP']['OUTPUT'] if 'ZnajdzDrzewaNaObszarachZalesionych_IP' in outputs \
                    else outputs['ZnajdzNasadzeniaUliczne_IP']['OUTPUT'] if 'ZnajdzNasadzeniaUliczne_IP' in outputs \
                    else outputs['UsunPoleMaxWysokosci_IP']['OUTPUT'],
                'RASTERCOPY': parameters['raster_z_klasami_drzewa'],
                'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
            }
            outputs['ProbkujKlasyDrzew'] = processing.run('native:rastersampling', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(33)
            if feedback.isCanceled():
                return {}

            # Zamień klasy drzew z decimal na string
            alg_params = {
                'FIELD_LENGTH': 9,
                'FIELD_NAME': 'klasa_drzewa',
                'FIELD_PRECISION': 0,
                'FIELD_TYPE': 2,  # Tekst (string)
                'FORMULA': 'if ("KLASA_1" = 1, \'liściaste\', \'iglaste\')',
                'INPUT': outputs['ProbkujKlasyDrzew']['OUTPUT'],
                'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
            }
            outputs['ZamienKlasyDrzewZDecimalNaString'] = processing.run('native:fieldcalculator', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(34)
            if feedback.isCanceled():
                return {}

            # Usuń decimal klasy drzew
            alg_params = {
                'COLUMN': ['KLASA_1'],
                'INPUT': outputs['ZamienKlasyDrzewZDecimalNaString']['OUTPUT'],
                'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
            }
            outputs['UsunDecimalKlasyDrzew'] = processing.run('native:deletecolumn', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(35)
            if feedback.isCanceled():
                return {}

            # Usuń decimal klasy drzew - indeks przestrzenny
            alg_params = {
                'INPUT': outputs['UsunDecimalKlasyDrzew']['OUTPUT']
            }
            outputs['UsunDecimalKlasyDrzew_IP'] = processing.run('native:createspatialindex', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(36)
            if feedback.isCanceled():
                return {}


        if parameters['dzialki_ewidencyjne'] is not None:
            
            # Twórz indeks przestrzenny działkom
            alg_params = {
                'INPUT': parameters['dzialki_ewidencyjne']
            }
            outputs['TworzIndeksPrzestrzennyDzialkom'] = processing.run('native:createspatialindex', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(37)
            if feedback.isCanceled():
                return {}

            # Policz punkty w poligonie
            alg_params = {
                'CLASSFIELD': '',
                'FIELD': 'NUMPOINTS',
                'POINTS': outputs['UsunDecimalKlasyDrzew_IP']['OUTPUT'] if 'UsunDecimalKlasyDrzew_IP' in outputs \
                    else outputs['ZnajdzDrzewaKsztaltujacePrzestrzenOCennymUkladziePrzestrzennym_IP']['OUTPUT'] if 'ZnajdzDrzewaKsztaltujacePrzestrzenOCennymUkladziePrzestrzennym_IP' in outputs \
                    else outputs['ZnajdzDrzewaNaObszarachMiejskich_IP']['OUTPUT'] if 'ZnajdzDrzewaNaObszarachMiejskich_IP' in outputs \
                    else outputs['ZnajdzDrzewaNaObszarachZalesionych_IP']['OUTPUT'] if 'ZnajdzDrzewaNaObszarachZalesionych_IP' in outputs \
                    else outputs['ZnajdzNasadzeniaUliczne_IP']['OUTPUT'] if 'ZnajdzNasadzeniaUliczne_IP' in outputs \
                    else outputs['UsunPoleMaxWysokosci_IP']['OUTPUT'],
                'POLYGONS': outputs['TworzIndeksPrzestrzennyDzialkom']['OUTPUT'],
                'WEIGHT': '',
                'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
            }
            outputs['PoliczPunktyWPoligonie'] = processing.run('native:countpointsinpolygon', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(38)
            if feedback.isCanceled():
                return {}

            # Punkty z ich liczbą na działce
            alg_params = {
                'DISCARD_NONMATCHING': False,
                'INPUT': outputs['UsunDecimalKlasyDrzew_IP']['OUTPUT'] if 'UsunDecimalKlasyDrzew_IP' in outputs \
                    else outputs['ZnajdzDrzewaKsztaltujacePrzestrzenOCennymUkladziePrzestrzennym_IP']['OUTPUT'] if 'ZnajdzDrzewaKsztaltujacePrzestrzenOCennymUkladziePrzestrzennym_IP' in outputs \
                    else outputs['ZnajdzDrzewaNaObszarachMiejskich_IP']['OUTPUT'] if 'ZnajdzDrzewaNaObszarachMiejskich_IP' in outputs \
                    else outputs['ZnajdzDrzewaNaObszarachZalesionych_IP']['OUTPUT'] if 'ZnajdzDrzewaNaObszarachZalesionych_IP' in outputs \
                    else outputs['ZnajdzNasadzeniaUliczne_IP']['OUTPUT'] if 'ZnajdzNasadzeniaUliczne_IP' in outputs \
                    else outputs['UsunPoleMaxWysokosci_IP']['OUTPUT'],
                'JOIN': outputs['PoliczPunktyWPoligonie']['OUTPUT'],
                'JOIN_FIELDS': ['POLE_EWIDE','NUMPOINTS'],
                'METHOD': 0,  # twórz oddzielny obiekt dla każdego pasującego obiektu (jeden do wielu)
                'PREDICATE': [0],  # przecinają się
                'PREFIX': '',
                'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
            }
            outputs['PunktyZIchLiczbaNaDzialce'] = processing.run('native:joinattributesbylocation', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(39)
            if feedback.isCanceled():
                return {}

            # Punkty z ich liczbą na działce - indeks przestrzenny
            alg_params = {
                'INPUT': outputs['PunktyZIchLiczbaNaDzialce']['OUTPUT']
            }
            outputs['TworzIndeksPrzestrzennyPunktomZIchLiczbaNaDziace_IP'] = processing.run('native:createspatialindex', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

            feedback.setCurrentStep(40)
            if feedback.isCanceled():
                return {}

        
        # Bonitacja
        alg_params = {
            'FIELD_LENGTH': 4,
            'FIELD_NAME': 'bonitacja',
            'FIELD_PRECISION': 1,
            'FIELD_TYPE': 0,  # Decimal (double)
            'FORMULA': '(if (coalesce("cenny_uk_przest" = True) OR coalesce("pomnik_przyrody" = True), 1.6, 0)) + \
                coalesce(if ("las" = True, 0.8, 0)) + coalesce(if ("teren_miejski" = True, 1.3, 0)) + \
                coalesce(if ("nasadz_ulicz" = True, 1.4, 0)) + \
                coalesce(if ("klasa_drzewa" = \'liściaste\', 1.2, if ("klasa_drzewa" = \'iglaste\', 0.9, 0))) + \
                if("NUMPOINTS" is None, 0, sqrt(sqrt(("NUMPOINTS") / ("POLE_EWIDE"))))',
            'INPUT': outputs['TworzIndeksPrzestrzennyPunktomZIchLiczbaNaDziace_IP']['OUTPUT'] if 'TworzIndeksPrzestrzennyPunktomZIchLiczbaNaDziace_IP' in outputs \
                else outputs['UsunDecimalKlasyDrzew_IP']['OUTPUT'] if 'UsunDecimalKlasyDrzew_IP' in outputs \
                    else outputs['ZnajdzDrzewaKsztaltujacePrzestrzenOCennymUkladziePrzestrzennym_IP']['OUTPUT'] if 'ZnajdzDrzewaKsztaltujacePrzestrzenOCennymUkladziePrzestrzennym_IP' in outputs \
                    else outputs['ZnajdzDrzewaNaObszarachMiejskich_IP']['OUTPUT'] if 'ZnajdzDrzewaNaObszarachMiejskich_IP' in outputs \
                    else outputs['ZnajdzDrzewaNaObszarachZalesionych_IP']['OUTPUT'] if 'ZnajdzDrzewaNaObszarachZalesionych_IP' in outputs \
                    else outputs['ZnajdzNasadzeniaUliczne_IP']['OUTPUT'] if 'ZnajdzNasadzeniaUliczne_IP' in outputs \
                    else outputs['UsunPoleMaxWysokosci_IP']['OUTPUT'],
            'OUTPUT': parameters['warstwa_punktowa_drzew']
        }
    
        outputs['Bonitacja'] = processing.run('native:fieldcalculator', alg_params, context=context, feedback=feedback, is_child_algorithm=True)
        results['Drzewa'] = outputs['Bonitacja']['OUTPUT']
        return results

    def name(self):
        return 'Przetwarzanie koron drzew'

    def displayName(self):
        return 'Przetwarzanie koron drzew'

    def group(self):
        return ''

    def groupId(self):
        return ''

    def shortHelpString(self):
        return """<html><body><p><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0//EN" "http://www.w3.org/TR/REC-html40/strict.dtd">
<html><head><meta name="qrichtext" content="1" /><style type="text/css">
</style></head><body style=" font-family:'MS Shell Dlg 2'; font-size:8.3pt; font-weight:400; font-style:normal;">
<p style=" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;">Algorytm przetwarza poligony koron drzew i filtruje je według parametrów wielkości. Następnie wyciąga atrybutry wg. lokalizacji wprowadzonych warstw wejściowych i oblicza na ich podstawie bonitację.</p></body></html></p>
<h2>Dane wejściowe</h2>
<h3>Poligony koron drzew</h3>
<p>Poligony koron drzew, będące warstwą wynikową alborytmu Canopy.R.</p>
<h3>Warstwa maski (granic miasta)</h3>
<p>Warstwa do której zostaną przycięte drzewa wg. lokalizacji.</p>
<h3>NMT</h3>
<p>Numeryczny model terenu. Na jego podstawie obliczana jest wysokość drzewa.</p>
<h3>Minimalna wysokość drzewa (m).</h3>
<p>Parametr wysokości w metrach, według której odfiltrowywane są zbyt niskie drzewa.</p>
<h3>Minimalna powierzchnia korony drzewa (m2).</h3>
<p>Parametr powierzchni w metrach kwadratowych, według którego odfiltrowywane są drzewa o zbyt małej powierzchni korony. Do poprawnego działania niezbędne jest wprowadzenie NMT.</p>
<h3>BDOT10k wody powierzchniowe</h3>
<p>Warstwa wektorowa wód powierzchniowych zaciągnięta z BDOT10k, lub innego źródła. Podanie tego parametru sprawi, że drzewa nie będą zlokalizowane na wodach powierzchniowych wg. lokalizacji.</p>
<h3>BDOT10k budynki</h3>
<p>Warstwa wektorowa budynków zaciągnięta z BDOT10k, lub innego źródła. Podanie tego parametru sprawi, że drzewa nie będą zlokalizowane na budynkach wg. lokalizacji.</p>
<h3>BDOT10k jezdnie</h3>
<p>Warstwa wektorowa jezdni zaciągnięta z BDOT10k, lub innego źródła, mająca atrybut wskazujący szerokość nawierzchni wyrażony w formie numerycznej.</p>
<h3>Atrybut szerokości jezdni</h3>
<p>Nazwa atrybutu z szerokością nawierzchni w warstwie wejściowej "BDOT10 jezdnie".</p>
<h3>BDOT10k tereny miejskie</h3>
<p>Warstwa wektorowa terenów miejskich zaciągnięta z BDOT10k, lub innego źródła.</p>
<h3>BDOT10k lasy</h3>
<p>Warstwa wektorowa lasów zaciągnięta z BDOT10k, lub innego źródła.</p>
<h3>Cenny układ przestrzenny</h3>
<p>Warstwa wektorowa wskazująca obszary o cennym układzie przestrzennym.</p>
<h3>Działki ewidencyjne</h3>
<p>Warstwa wektorowa z działkami ewidencyjnymi zaciągniętymi z EGiB.</p>
<h3>Raster z klasami drzewa</h3>
<p>Raster zawierający dane o klasie drzewa, gdzie wartość 1 oznacza drzewo liściaste, a 0 drzewo iglaste.</p>
<h3>Pomniki przyrody</h3>
<p>Warstwa punktowa z pomnikami przyrody.</p>
<h2>Dane wyjściowe</h2>
<h3>Warstwa punktowa drzew</h3>
<p>Wynikiem jest warstwa punktowa reprezentująca pojedyncze drzewa o następujących atrybutach:
fid - id nadawane przez QGIS,
treeID - id drzewa,
npoints - suma punktów z chmury punktów wewnątrz korony drzewa,
area_m2 - powierzchnia korony drzewa w metrach kwadratowych,
pomnik_przyrody - true jeśli w obrębie korony drzewa znajdował się pomnik przyrody,
h - wysokość drzewa w metrach,
nasadz_ulicz - true jeśli drzewo znajduje się w odległości do 2 metrów od krawędzi jezdni,
las - true jeśli drzewo znajduje się w obrębie lasu,
teren_miejski - true jeśli drzewo znajduje się w obrębie zabudowy miejskiej,
cenny_uk_przest - true jeślii drzewo znajduje się w obrębie obszaru o cennym układzie przestrzennym,
klasa_drzewa - drzewo liściaste lub iglaste,
POLE_EWIDE - powierzchnia ewidencyjna działki w hektarach, na której znajduje się drzewo,
NUMPOINTS - suma drzew znajdujących się w obrębie działki, na której leży drzewo,
bonitacja - wynik bonitacji</p>
<p><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0//EN" "http://www.w3.org/TR/REC-html40/strict.dtd">
<html><head><meta name="qrichtext" content="1" /><style type="text/css">
</style></head><body style=" font-family:'MS Shell Dlg 2'; font-size:8.3pt; font-weight:400; font-style:normal;">
<p style="-qt-paragraph-type:empty; margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;"><br /></p></body></html></p><br><p align="right">Autor algorytmu: Paweł Radomski</p><p align="right">Wersja algorytmu: 0.1</p></body></html>"""

    def createInstance(self):
        return PrzetwarzanieKoronDrzew()
